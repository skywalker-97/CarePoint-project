import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, HeartPulse, ClipboardList } from 'lucide-react';

const HealthSummaryCard = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-premium flex items-center gap-5"
            >
                <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                    <HeartPulse size={24} />
                </div>
                <div>
                    <p className="text-2xl font-[900] text-slate-900 tracking-tight">{stats.totalAppointments}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Total Visits</p>
                </div>
            </motion.div>

            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-premium flex items-center gap-5"
            >
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                    <ClipboardList size={24} />
                </div>
                <div>
                    <p className="text-2xl font-[900] text-slate-900 tracking-tight">{stats.activePrescriptions}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Prescriptions</p>
                </div>
            </motion.div>

            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-premium flex items-center gap-5"
            >
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <p className="text-2xl font-[900] text-slate-900 tracking-tight">{stats.completedVisits}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Completed</p>
                </div>
            </motion.div>

            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-premium flex items-center gap-5"
            >
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                    <Activity size={24} />
                </div>
                <div>
                    <p className="text-2xl font-[900] text-slate-900 tracking-tight">{stats.healthScore}%</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Onboarding %</p>
                </div>
            </motion.div>
        </div>
    );
};

export default HealthSummaryCard;
