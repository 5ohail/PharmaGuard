import React, { useEffect, useState } from 'react';
import { FileText, Clock, Trash2, ChevronRight, X, ShieldCheck, Activity, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClinicalLogs = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null); // Track which log to show details for

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('pgx_logs') || '[]');
    setLogs(savedLogs);
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to delete all diagnostic history?")) {
      localStorage.removeItem('pgx_logs');
      setLogs([]);
    }
  };

  const getSeverityStyle = (severity) => {
    if (severity === 'critical') return 'bg-red-100 text-red-700 border-red-200';
    if (severity === 'high') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-800">
            Diagnostic <span className="text-blue-600">History</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Locally stored session reports • <span className="text-slate-800 font-bold">{logs.length} Total</span>
          </p>
        </div>
        
        {logs.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest shadow-sm"
          >
            <Trash2 size={16} /> Clear Vault
          </button>
        )}
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {logs.length > 0 ? (
          logs.map((log, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedLog(log)} // Click to open details
              className="group bg-white p-6 rounded-[28px] flex items-center justify-between border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">
                      {log.drug}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">ID: {log.patientId}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5 mt-1">
                    <Clock size={12} /> {log.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border ${getSeverityStyle(log.severity)}`}>
                  {log.risk}
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
              </div>
            </div>
          ))
        ) : (
          <div className="h-64 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <Clock size={48} className="mb-4 opacity-10" />
            <p className="font-black uppercase text-xs tracking-[0.3em]">No diagnostic history available</p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedLog(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {/* Modal Header */}
                <div className="mb-8">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Archived Report</span>
                  <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
                    {selectedLog.drug} Analysis
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">Patient Reference: {selectedLog.patientId} • {selectedLog.date}</p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Risk Status</p>
                    <p className={`font-black uppercase ${selectedLog.severity === 'critical' ? 'text-red-600' : 'text-emerald-600'}`}>
                      {selectedLog.risk}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Confidence Score</p>
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={14} className="text-blue-500" />
                       <p className="font-black text-slate-800">{selectedLog.confidence || '98'}%</p>
                    </div>
                  </div>
                </div>

                {/* Biological Insight Section */}
                <div className="space-y-6">
                  <div>
                    <h5 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase mb-3">
                      <Activity size={14} className="text-blue-500" /> Biological Mechanism
                    </h5>
                    <p className="text-slate-600 leading-relaxed text-sm font-medium italic">
                      "{selectedLog.mechanism || "Genomic variants in the metabolic pathway influence the processing of this medication, potentially altering efficacy or increasing toxicity risk."}"
                    </p>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100">
                    <h5 className="flex items-center gap-2 text-xs font-black text-blue-700 uppercase mb-2">
                      <Pill size={14} /> Clinical Recommendation
                    </h5>
                    <p className="text-blue-900 font-bold text-sm">
                      {selectedLog.action || "Consult with a healthcare provider to adjust dosage based on genetic metabolic profile."}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer Action */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all"
                >
                  Close Archive
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClinicalLogs;