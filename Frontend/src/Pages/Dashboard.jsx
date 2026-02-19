import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Activity, FileText, Download, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [drug, setDrug] = useState('CODEINE');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // --- PDF GENERATION LOGIC ---
  const generatePDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("PharmaGuard Clinical Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Analysis Value']],
      body: [
        ['Patient ID', result.patient_id || "N/A"],
        ['Target Drug', result.drug],
        ['Primary Gene', result.pharmacogenomic_profile?.primary_gene || "N/A"],
        ['Phenotype', result.pharmacogenomic_profile?.phenotype || "N/A"],
        ['Risk Level', result.risk_assessment?.risk_label || "N/A"]
      ],
      headStyles: { fillColor: [37, 99, 235] },
      theme: 'grid'
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Clinical Recommendation", 14, finalY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60);
    
    // Safety check for text properties
    const recText = result.clinical_recommendation?.text || "No recommendation found.";
    const splitText = doc.splitTextToSize(recText, 180);
    doc.text(splitText, 14, finalY + 10);

    doc.save(`PharmaGuard_${result.drug}_Report.pdf`);
  };

  // --- API CALL ---
  const handleRunAnalysis = async () => {
    if (!file) return alert("Please upload a VCF file first.");
    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('vcf', file);
    formData.append('drug', drug);

    try {
      // Ensure this URL matches your backend port (e.g., 5000)
      const response = await axios.post('http://localhost:3001/api/v1/analyze', formData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Analysis failed. Please check if your backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
            Genomic <span className="text-blue-600">Analysis Console</span>
          </h1>
          <p className="text-slate-500 font-medium">Industry-standard VCF v4.2 processing engine.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Inputs */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200">
              <label className="block text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">1. VCF Dataset</label>
              <div 
                className={`border-2 border-dashed rounded-2xl p-6 transition-all text-center cursor-pointer ${file ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('vcf-upload').click()}
              >
                <input type="file" id="vcf-upload" hidden onChange={(e) => setFile(e.target.files[0])} accept=".vcf" />
                <Upload className={`mx-auto mb-2 ${file ? 'text-blue-600' : 'text-slate-400'}`} />
                <p className="text-sm font-bold text-slate-700">{file ? file.name : "Select or Drop VCF"}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">Max Size: 5MB</p>
              </div>

              <label className="block text-xs font-black uppercase text-slate-400 mt-8 mb-4 tracking-widest">2. Target Medication</label>
              <select 
                value={drug}
                onChange={(e) => setDrug(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-100 border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {['CODEINE', 'WARFARIN', 'CLOPIDOGREL', 'SIMVASTATIN', 'AZATHIOPRINE', 'FLUOROURACIL'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <button 
                onClick={handleRunAnalysis}
                disabled={loading}
                className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                {loading ? <RefreshCcw className="animate-spin" /> : "Run AI Analysis"}
              </button>
            </div>
          </div>

          {/* RIGHT: Results Display */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 p-6 rounded-[32px] flex items-start gap-4 text-red-700 mb-6">
                  <AlertCircle className="shrink-0" />
                  <div>
                    <p className="font-black uppercase text-xs mb-1">Error Detected</p>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </motion.div>
              )}

              {result ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  
                  {/* Risk Alert Card */}
                  <div className={`p-8 rounded-[40px] flex items-center justify-between shadow-xl text-white ${result.risk_assessment?.severity === 'high' || result.risk_assessment?.severity === 'critical' ? 'bg-red-600' : 'bg-green-500'}`}>
                    <div>
                      <p className="text-xs font-black uppercase opacity-80 tracking-widest">Risk Assessment</p>
                      <h2 className="text-4xl font-black tracking-tight">{result.risk_assessment?.risk_label}</h2>
                    </div>
                    <Activity size={48} className="opacity-40" />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Genomic Profile</p>
                      <p className="text-xl font-black text-slate-800">{result.pharmacogenomic_profile?.primary_gene} {result.pharmacogenomic_profile?.diplotype}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Metabolizer Status</p>
                      <p className="text-xl font-black text-slate-800">{result.pharmacogenomic_profile?.phenotype}</p>
                    </div>
                  </div>

                  {/* Clinical Guidance Section */}
                  <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="text-blue-600" size={20} />
                      <h3 className="font-black text-slate-800 uppercase tracking-tight">Clinical Guidance</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium text-lg mb-6">
                      {result.clinical_recommendation?.text}
                    </p>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Medical Evidence</p>
                        <p className="text-xs text-slate-500 font-bold">{result.clinical_recommendation?.guideline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Confidence</p>
                        <p className="text-xs text-slate-500 font-bold">{(result.risk_assessment?.confidence_score * 100)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex gap-4">
                    <button onClick={generatePDF} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg">
                      <Download size={18} /> Export Clinical PDF
                    </button>
                  </div>

                </motion.div>
              ) : (
                !loading && (
                  <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-slate-400">
                    <FileText size={48} className="mb-4 opacity-10" />
                    <p className="font-bold italic">Awaiting Genetic Sequence Input...</p>
                  </div>
                )
              )}
              
              {loading && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center">
                  <RefreshCcw className="animate-spin text-blue-600 mb-4" size={40} />
                  <p className="font-black text-slate-600 uppercase tracking-widest">AI Cross-Referencing Guidelines...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;