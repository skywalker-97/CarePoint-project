import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Download, User, Activity } from 'lucide-react';

const MedicalRecordsTimeline = ({ records, onDownload }) => {
    if (!records || records.length === 0) {
        return (
            <div className="bg-white rounded-[48px] p-16 text-center border border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found yet</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-100 hidden md:block"></div>

            <div className="space-y-12">
                {records.map((record, index) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={record._id} 
                        className="relative flex flex-col md:flex-row gap-8"
                    >
                        {/* Timeline Node */}
                        <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-10 h-10 bg-white border-4 border-slate-50 rounded-full items-center justify-center z-10 shadow-sm">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>

                        {/* Date Side */}
                        <div className="md:w-32 flex-shrink-0 md:pt-2">
                            <p className="text-sm font-black text-slate-900">{new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(record.createdAt).getFullYear()}</p>
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium hover:shadow-2xl transition-all group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 bg-blue-50 text-primary text-[9px] font-black uppercase tracking-widest rounded-full">
                                            {record.docId?.speciality || 'General Consultation'}
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-[900] text-slate-900 tracking-tight">
                                        Diagnosis: {record.diagnosis}
                                    </h4>
                                    <div className="flex flex-wrap gap-6 text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-slate-300" />
                                            <p className="text-xs font-bold uppercase tracking-wider">Dr. {record.docId?.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Activity size={14} className="text-slate-300" />
                                            <p className="text-xs font-bold uppercase tracking-wider">{record.items?.length || 0} Medications</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center md:items-start">
                                    <button 
                                        onClick={() => onDownload(record.appointmentId)}
                                        className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10 group"
                                    >
                                        <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                        Get Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MedicalRecordsTimeline;
