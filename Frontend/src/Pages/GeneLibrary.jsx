import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, Info } from 'lucide-react';

const GeneLibrary = () => {
  const genes = [
    { name: "CYP2D6", medication: "Codeine, Tamoxifen", desc: "The 'Swiss Army Knife' of enzymes. Affects 25% of all clinical drugs." },
    { name: "CYP2C19", medication: "Clopidogrel, Omeprazole", desc: "Crucial for anti-platelet activation. Major variations in Asian populations." },
    { name: "SLCO1B1", medication: "Simvastatin", desc: "Transports drugs into the liver. Variants can cause muscle toxicity (myopathy)." },
    { name: "VKORC1", medication: "Warfarin", desc: "The primary target for blood thinners. Highly sensitive to genetic dosage adjustments." }
  ];

  return (
    <div className="min-h-screen pt-32 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-black mb-12 tracking-tighter">Pharmacogenomic <span className="text-blue-600">Reference</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {genes.map((g, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="neo-flat p-8 rounded-[40px] bg-[#e0e5ec]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl neo-inset text-blue-600"><Beaker size={20} /></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database ID: PGx-0{i+1}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800">{g.name}</h3>
            <p className="text-xs font-bold text-blue-500 mb-4 uppercase">Primary Impact: {g.medication}</p>
            <p className="text-sm text-slate-500 leading-relaxed">{g.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GeneLibrary;