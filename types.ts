export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  points: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  location: string;
}

export interface ResumeData {
  name: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  skills: {
    category: string;
    items: string;
  }[];
  experience: Experience[];
  education: Education[];
  languages: string[];
  certificates: string[];
}