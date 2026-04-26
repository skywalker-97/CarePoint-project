import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data, currency }) => {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium h-[400px] flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-[900] text-slate-900 tracking-tight">Revenue Analytics</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly performance</p>
                </div>
            </div>
            
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} 
                        />
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                padding: '12px'
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="earning" 
                            stroke="#2563EB" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorEarning)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
