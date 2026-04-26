import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, FileText, BadgeCheck } from 'lucide-react';

const ApprovalQueue = ({ doctors, onApprove, onReject }) => {
    if (!doctors || doctors.length === 0) {
        return (
            <div className="bg-slate-50 rounded-[40px] p-12 text-center border border-dashed border-slate-200">
                <BadgeCheck size={48} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No pending verifications</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {doctors.map((doc, index) => (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={doc._id} 
                    className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-premium flex items-center justify-between group"
                >
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img src={doc.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-lg flex items-center justify-center border-2 border-white">
                                <FileText size={10} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-[900] text-slate-900 tracking-tight">{doc.name}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.speciality}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => onApprove(doc._id)}
                            className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-100/50"
                        >
                            <CheckCircle size={20} />
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ApprovalQueue;
