import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-premium group flex flex-col gap-4"
        >
            <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl ${color} transition-colors`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trendValue}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-3xl font-[900] text-slate-900 tracking-tight">{value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{title}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;
