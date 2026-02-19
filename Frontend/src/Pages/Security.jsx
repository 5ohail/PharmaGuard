import React from 'react';
import { ShieldCheck, Lock, EyeOff, Globe } from 'lucide-react';

const Security = () => {
  const features = [
    { icon: <Lock />, title: "End-to-End Encryption", desc: "VCF data is encrypted during transit to our PGx engine." },
    { icon: <EyeOff />, title: "Zero-Retention Policy", desc: "Genomic sequences are processed in-memory and purged after analysis." },
    { icon: <ShieldCheck />, title: "HIPAA Alignment", desc: "Architected following international healthcare data privacy standards." },
    { icon: <Globe />, title: "Local Processing", desc: "Prioritizing local parsing to minimize data exposure risk." }
  ];

  return (
    <div className="min-h-screen pt-32 px-6 max-w-5xl mx-auto flex flex-col items-center">
      <div className="text-center mb-16">
        <div className="w-20 h-20 rounded-[30px] neo-flat flex items-center justify-center text-blue-600 mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-4xl font-black tracking-tighter">Security & <span className="text-blue-600">Privacy</span></h2>
        <p className="text-slate-500 mt-4">Ensuring genomic integrity for the RIFT 2026 ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {features.map((f, i) => (
          <div key={i} className="neo-flat p-8 rounded-[40px] bg-[#e0e5ec]">
            <div className="text-blue-600 mb-4">{f.icon}</div>
            <h4 className="font-black text-slate-800 uppercase text-sm mb-2">{f.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Security;