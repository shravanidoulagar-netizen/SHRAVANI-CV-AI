import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';

// Helper to convert Float32Array to 16-bit PCM for input
function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return output.buffer;
}

// Helper to encode array buffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to decode base64 to array buffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const useLiveAvatar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  // Refs for audio handling
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  
  // Refs for analysis
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  
  // Session handling
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sessionRef = useRef<any>(null);

  const connect = useCallback(async () => {
    try {
      setError(null);
      
      // Initialize GoogleGenAI
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // 1. Setup Audio Input
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputContextRef.current = inputCtx;
      
      const source = inputCtx.createMediaStreamSource(stream);
      inputSourceRef.current = source;

      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 256;
      inputAnalyserRef.current = analyser;

      // Use ScriptProcessor for capturing audio chunks (Worklet is preferred but complex for single-file demo)
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(inputCtx.destination);

      // 2. Setup Audio Output
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputContextRef.current = outputCtx;
      
      const outAnalyser = outputCtx.createAnalyser();
      outAnalyser.fftSize = 256;
      outputAnalyserRef.current = outAnalyser;

      // 3. Connect to Gemini Live API
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            setIsConnected(true);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle audio output from model
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              const audioBufferChunk = base64ToArrayBuffer(audioData);
              
              // Decode audio
              const float32Data = new Float32Array(audioBufferChunk.byteLength / 2);
              const dataView = new DataView(audioBufferChunk);
              for (let i = 0; i < float32Data.length; i++) {
                float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
              }
              
              const audioBuffer = outputCtx.createBuffer(1, float32Data.length, 24000);
              audioBuffer.copyToChannel(float32Data, 0);

              const playSource = outputCtx.createBufferSource();
              playSource.buffer = audioBuffer;
              
              playSource.connect(outAnalyser);
              outAnalyser.connect(outputCtx.destination);

              // Schedule playback
              const currentTime = outputCtx.currentTime;
              const startTime = Math.max(nextStartTimeRef.current, currentTime);
              playSource.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;
              
              playSource.onended = () => {
                // Approximate "speaking" state end is hard with streaming, 
                // but we can check if queue is empty roughly
                if (outputCtx.currentTime >= nextStartTimeRef.current) {
                  setIsSpeaking(false);
                }
              };
            }
          },
          onclose: () => {
            console.log("Gemini Live Closed");
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error("Gemini Live Error", err);
            setError("Connection error. Please try again.");
            setIsConnected(false);
          }
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

      // 4. Send Audio Input to Model
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate volume for UI
        let sum = 0;
        for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
        const rms = Math.sqrt(sum / inputData.length);
        setVolume(rms);

        // Send to Gemini
        const pcm16 = floatTo16BitPCM(inputData);
        const base64Data = arrayBufferToBase64(pcm16);

        sessionPromise.then((session) => {
            sessionRef.current = session;
            session.sendRealtimeInput({
                media: {
                    mimeType: 'audio/pcm;rate=16000',
                    data: base64Data
                }
            });
        });
      };

    } catch (err) {
      console.error(err);
      setError("Failed to initialize audio or connection.");
      setIsConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    // Stop recording
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (inputSourceRef.current) {
        inputSourceRef.current.disconnect();
        inputSourceRef.current = null;
    }
    if (inputContextRef.current) {
        inputContextRef.current.close();
        inputContextRef.current = null;
    }

    // Stop playback
    if (outputContextRef.current) {
        outputContextRef.current.close();
        outputContextRef.current = null;
    }

    // Close session
    if (sessionRef.current) {
       sessionRef.current.close();
       sessionRef.current = null;
    }
    
    setIsConnected(false);
    setIsSpeaking(false);
    setVolume(0);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    isConnected,
    isSpeaking,
    error,
    volume,
    inputAnalyser: inputAnalyserRef.current,
    outputAnalyser: outputAnalyserRef.current,
  };
};