import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  BrainCircuit, 
  User, 
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Mic,
  MicOff,
  Activity
} from 'lucide-react';
import { ResumeSection } from './components/ResumeSection';
import { AudioVisualizer } from './components/AudioVisualizer';
import { useLiveAvatar } from './hooks/useLiveAvatar';
import { RESUME_DATA } from './constants';

const App: React.FC = () => {
  const { 
    connect, 
    disconnect, 
    isConnected, 
    isSpeaking, 
    error, 
    volume, 
    outputAnalyser 
  } = useLiveAvatar();

  const handleToggleConnection = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header / Hero */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {RESUME_DATA.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{RESUME_DATA.name}</h1>
              <p className="text-slate-500 font-medium">{RESUME_DATA.title}</p>
            </div>
          </div>
          
          {/* Voice Control Panel */}
          <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl pr-6">
            <button
              onClick={handleToggleConnection}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all shadow-sm
                ${isConnected 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              {isConnected ? <MicOff size={18} /> : <Mic size={18} />}
              {isConnected ? 'End Call' : 'Talk to Shravani'}
            </button>
            
            <div className="h-10 w-48 bg-slate-200 rounded-lg overflow-hidden relative">
              {isConnected ? (
                <AudioVisualizer 
                  analyser={outputAnalyser} 
                  isActive={true} 
                  barColor={isSpeaking ? '#8b5cf6' : '#3b82f6'}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-medium uppercase tracking-wider">
                  <Activity size={14} className="mr-1.5" />
                  Voice AI Offline
                </div>
              )}
            </div>
          </div>
        </div>
        
        {error && (
            <div className="bg-red-50 text-red-600 text-sm py-2 text-center border-t border-red-100">
                {error}
            </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Summary & Contact */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex flex-col gap-4 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={16} />
                    <a href={`mailto:${RESUME_DATA.contact.email}`} className="hover:text-blue-600 transition-colors">
                        {RESUME_DATA.contact.email}
                    </a>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={16} />
                    <span>{RESUME_DATA.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                    <MapPin size={16} />
                    <span>{RESUME_DATA.contact.location}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                    <Linkedin size={16} />
                    <a href={`https://${RESUME_DATA.contact.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors truncate">
                        {RESUME_DATA.contact.linkedin}
                    </a>
                </div>
            </div>
          </div>

          <ResumeSection title="Profile" icon={User}>
            <p className="text-slate-600 leading-relaxed text-sm">
              {RESUME_DATA.summary}
            </p>
          </ResumeSection>

          <ResumeSection title="Skills" icon={BrainCircuit}>
            <div className="space-y-4">
              {RESUME_DATA.skills.map((skill, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">{skill.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.split(', ').map((item, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ResumeSection>

           <ResumeSection title="Languages" icon={Languages}>
             <div className="flex flex-wrap gap-2">
                {RESUME_DATA.languages.map((lang, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-lg font-medium">
                        {lang}
                    </span>
                ))}
             </div>
          </ResumeSection>

        </div>

        {/* Right Column: Experience & Education */}
        <div className="lg:col-span-8 space-y-6">
          <ResumeSection title="Professional Experience" icon={Briefcase}>
            <div className="space-y-8">
              {RESUME_DATA.experience.map((job, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-slate-200">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-800">{job.role}</h3>
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {job.period}
                    </span>
                  </div>
                  <div className="text-blue-600 font-medium text-sm mb-3">
                    {job.company} • {job.location}
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-2 text-slate-600 text-sm marker:text-slate-400">
                    {job.points.map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResumeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResumeSection title="Education" icon={GraduationCap}>
                <div className="space-y-6">
                    {RESUME_DATA.education.map((edu, idx) => (
                        <div key={idx} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                            <h3 className="font-bold text-slate-800 text-sm">{edu.degree}</h3>
                            <div className="text-blue-600 text-xs mt-1 font-medium">{edu.institution}</div>
                            <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                                <span>{edu.year}</span>
                                <span>{edu.location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </ResumeSection>

            <ResumeSection title="Certificates" icon={Award}>
                <ul className="space-y-3">
                    {RESUME_DATA.certificates.map((cert, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                            {cert}
                        </li>
                    ))}
                </ul>
            </ResumeSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;