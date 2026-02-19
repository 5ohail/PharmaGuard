import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, ShieldCheck, Beaker } from 'lucide-react';

const About = () => {
  const techStack = [
    { icon: <Cpu />, title: "llama-3.1-8b-instant", desc: "AI engine for pathophysiological explanations." },
    { icon: <Database />, title: "CPIC Guidelines", desc: "Evidence-based clinical dosing logic." },
    { icon: <Beaker />, title: "VCF Parsing", desc: "Robust handling of genomic variant files." },
    { icon: <ShieldCheck />, title: "Node.js/Express", desc: "Secure and scalable backend architecture." }
  ];

  return (
    <div className="min-h-screen pt-32 px-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
        
        {/* Mission Statement */}
        <section className="text-center space-y-4">
          <h2 className="text-5xl font-black tracking-tighter text-slate-800">Mission <span className="text-blue-600">Brief</span></h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            PharmaGuard bridges the gap between complex genomic data and clinical actionability, 
            reducing Adverse Drug Reactions (ADRs) through AI-driven personalized medicine.
          </p>
        </section>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techStack.map((tech, i) => (
            <motion.div 
              key={i}
              initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-8 rounded-[40px] flex items-start gap-6 hover:bg-white/40 transition-all"
            >
              <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-lg">
                {tech.icon}
              </div>
              <div>
                <h4 className="font-black text-slate-800 uppercase tracking-tight">{tech.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{tech.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scientific Context */}
        <section className="neo-flat p-10 rounded-[50px]">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Beaker className="text-blue-600" /> THE SCIENCE
          </h3>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              Genetic variations in enzymes like <strong>CYP2D6</strong> or <strong>CYP2C19</strong> 
              can cause drugs to be metabolized too quickly (ineffective) or too slowly (toxic).
            </p>
            <div className="p-6 rounded-3xl neo-inset bg-[#e0e5ec]/50 border border-white/40 italic">
              "PharmaGuard parses VCF files to identify these variants and cross-references them 
              with CPIC guidelines to generate real-time safety reports."
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default About;