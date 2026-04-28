import React, { useState, useEffect, useContext } from 'react';
import { X, History, Pill, FileText, Calendar, Sparkles, Loader2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PatientHistoryModal = ({ history, onClose, patientName }) => {
    const { dToken } = useContext(DoctorContext);
    const { backendUrl } = useContext(AppContext);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (history && history.length > 0) {
            fetchAISummary();
        }
    }, [history]);

    const fetchAISummary = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(
                backendUrl + '/api/ai/summarize-history',
                { history },
                { headers: { dtoken: dToken } }
            );
            if (data.success) {
                setSummary(data.summary);
            }
        } catch (error) {
            console.log("AI Summary Error:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col font-inter"
            >
                {/* Header */}
                <div className="p-8 bg-[#F8FAFC] border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                            <History size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-[900] text-slate-900 tracking-tight">Medical History</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{patientName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                    
                    {/* AI Intelligence Card */}
                    {(loading || summary) && (
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles size={80} className="text-primary" />
                            </div>
                            
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                        <Sparkles size={18} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest">Patient Intelligence Card</h3>
                                </div>
                                {summary && (
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        summary.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-400' :
                                        summary.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                        <ShieldAlert size={12} /> {summary.riskLevel} Risk
                                    </div>
                                )}
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-4">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">AI is analyzing history...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Chronic Conditions</p>
                                            <div className="flex flex-wrap gap-2">
                                                {summary.chronicConditions?.map((c, i) => (
                                                    <span key={i} className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/5">{c}</span>
                                                )) || <span className="text-xs font-medium text-slate-500 italic">None detected</span>}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Allergies</p>
                                            <div className="flex flex-wrap gap-2">
                                                {summary.allergies?.map((a, i) => (
                                                    <span key={i} className="text-xs font-bold text-rose-300 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">{a}</span>
                                                )) || <span className="text-xs font-medium text-slate-500 italic">None detected</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recent Health Trends</p>
                                        <p className="text-xs font-medium leading-relaxed text-slate-300">{summary.recentTrends}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Clinical Timeline</p>
                        {(history || []).length > 0 ? (
                            (history || []).map((item, index) => (
                            <div key={index} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Diagnosis</p>
                                        <h4 className="text-lg font-black text-slate-800">{item.diagnosis || 'N/A'}</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                        <p className="text-xs font-bold text-slate-600">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prescribed Medicines</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(item.items || []).map((med, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                                                <Pill size={12} className="text-primary" /> {med.medicine} ({med.dosage})
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                    <p className="text-[10px] font-bold text-slate-400 italic">Dr. {item.docId?.name || 'Unknown'} ({item.docId?.speciality || 'Specialist'})</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 font-bold">No previous prescriptions found for this patient.</p>
                        </div>
                    )}
                </div>
                {/* END history list */}
                </div>
                {/* END content scroll area */}
            </motion.div>
        </div>
    );
};

export default PatientHistoryModal;
