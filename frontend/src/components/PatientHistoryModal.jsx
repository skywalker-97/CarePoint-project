import React from 'react';
import { X, History, Pill, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const PatientHistoryModal = ({ history, onClose, patientName }) => {
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
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {history.length > 0 ? (
                        history.map((item, index) => (
                            <div key={index} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Diagnosis</p>
                                        <h4 className="text-lg font-black text-slate-800">{item.diagnosis}</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                        <p className="text-xs font-bold text-slate-600">{new Date(item.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prescribed Medicines</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.items.map((med, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                                                <Pill size={12} className="text-primary" /> {med.medicine} ({med.dosage})
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                    <p className="text-[10px] font-bold text-slate-400 italic">Dr. {item.docId.name} ({item.docId.speciality})</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 font-bold">No previous prescriptions found for this patient.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PatientHistoryModal;
