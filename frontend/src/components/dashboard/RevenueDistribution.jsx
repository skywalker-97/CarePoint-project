import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const RevenueDistribution = ({ data }) => {
    const chartData = [
        { name: 'Doctor Earnings', value: data.doctorPayouts },
        { name: 'Platform Commission', value: data.platformCommission }
    ];

    const COLORS = ['#2563EB', '#10B981'];

    return (
        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-premium h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Health</p>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Distribution</h3>
                </div>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-400">Gross Platform Volume</p>
                    <p className="text-lg font-black text-slate-900">${data.totalRevenue}</p>
                </div>
            </div>
        </div>
    );
};

export default RevenueDistribution;
