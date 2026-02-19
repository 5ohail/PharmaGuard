import React, { useEffect, useState } from 'react';
import { FileText, Clock, Trash2 } from 'lucide-react';

const ClinicalLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('pgx_logs') || '[]');
    setLogs(savedLogs);
  }, []);

  return (
    <div className="min-h-screen pt-32 px-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Diagnostic <span className="text-blue-600">History</span></h2>
          <p className="text-slate-500 font-medium">Locally stored session reports for RIFT 2026</p>
        </div>
        <button 
          onClick={() => { localStorage.clear(); setLogs([]); }}
          className="p-4 rounded-2xl neo-flat text-red-500 hover:neo-inset transition-all"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {logs.length > 0 ? logs.map((log, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl flex items-center justify-between border border-white/40">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-white/50 text-blue-600 shadow-sm"><FileText /></div>
              <div>
                <h4 className="font-black text-slate-800">{log.drug} Analysis</h4>
                <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Clock size={12} /> {log.date}
                </p>
              </div>
            </div>
            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${log.risk === 'Safe' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {log.risk}
            </div>
          </div>
        )) : (
          <div className="neo-inset h-40 rounded-[40px] flex items-center justify-center text-slate-400 font-bold italic">
            No diagnostic history found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalLogs;