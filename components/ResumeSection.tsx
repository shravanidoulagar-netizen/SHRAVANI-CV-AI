import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ResumeSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Icon size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
};