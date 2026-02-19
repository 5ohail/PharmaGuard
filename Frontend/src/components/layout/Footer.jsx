import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => (
  <footer className="mt-20 py-10 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="neo-flat px-6 py-3 rounded-2xl flex items-center gap-6">
        <Github size={18} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
        <Twitter size={18} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
        <Linkedin size={18} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
      </div>
      
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        © 2026 RIFT Hackathon Submission • PharmaGuard AI
      </p>

      <div className="neo-inset px-4 py-2 rounded-xl">
        <span className="text-[10px] font-bold text-blue-500 uppercase">Version 1.0.4 stable</span>
      </div>
    </div>
  </footer>
);

export default Footer;