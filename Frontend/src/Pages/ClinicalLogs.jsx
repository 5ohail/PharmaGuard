import React, { useEffect, useState } from 'react';
import { FileText, Clock, Trash2, ChevronRight } from 'lucide-react';

const ClinicalLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch logs from localStorage on component mount
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
      {/* Header */}
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
              className="group bg-white p-6 rounded-[28px] flex items-center justify-between border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-default"
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
    </div>
  );
};

export default ClinicalLogs;