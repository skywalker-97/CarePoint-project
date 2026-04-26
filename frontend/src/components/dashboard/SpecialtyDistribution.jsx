import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SpecialtyDistribution = ({ data }) => {
    const COLORS = ['#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#059669', '#4F46E5', '#9333EA'];

    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium h-[400px] flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-[900] text-slate-900 tracking-tight">Market Distribution</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">By Medical Specialty</p>
                </div>
            </div>
            
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                            }} 
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpecialtyDistribution;
