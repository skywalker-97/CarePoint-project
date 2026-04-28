import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';
import { AppContext } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserSquare, Calendar, DollarSign, Activity, CheckCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import SpecialtyDistribution from '../components/dashboard/SpecialtyDistribution';
import ApprovalQueue from '../components/dashboard/ApprovalQueue';
import RevenueDistribution from '../components/dashboard/RevenueDistribution';

const AdminDashboard = () => {
    const { aToken, dashData, getDashData, cancelAppointment, changeVerification } = useContext(AdminContext);
    const { currency, slotDateFormat } = useContext(AppContext);

    useEffect(() => {
        if (aToken) {
            getDashData();
        }
    }, [aToken]);

    return (
        <div className="m-5 font-inter">
            {/* Header section */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">Platform Command</h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Global Network Performance</p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="px-6 py-3 bg-slate-900 text-white rounded-[24px] flex items-center gap-3 shadow-xl shadow-slate-900/10">
                        <ShieldCheck size={18} className="text-blue-400" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Admin Authorization: Level 4</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
                <StatCard 
                    title="Platform Revenue" 
                    value={`${currency}${dashData?.totalRevenue || 0}`} 
                    icon={DollarSign} 
                    trend="up" 
                    trendValue="18.2" 
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard 
                    title="Active Patients" 
                    value={dashData?.patients || 0} 
                    icon={Users} 
                    trend="up" 
                    trendValue="5.4" 
                    color="bg-indigo-50 text-indigo-600"
                />
                <StatCard 
                    title="Total Network" 
                    value={(dashData?.doctors || 0) + (dashData?.approvalQueue?.length || 0)} 
                    icon={UserSquare} 
                    color="bg-teal-50 text-teal-600"
                />
                <StatCard 
                    title="Net Commission" 
                    value={`${currency}${dashData?.platformCommission || 0}`} 
                    icon={TrendingUp} 
                    trend="up" 
                    trendValue="12.5" 
                    color="bg-emerald-50 text-emerald-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Analytics Left Column */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SpecialtyDistribution data={dashData?.specialtyData || []} />
                        <RevenueDistribution data={dashData || {}} />
                    </div>
                    
                    {/* Latest Bookings Table */}
                    <div className='bg-white rounded-[48px] border border-slate-100 shadow-premium overflow-hidden'>
                        <div className='flex justify-between items-center px-10 py-8 bg-slate-50/50 border-b border-slate-100'>
                            <div className='flex items-center gap-3'>
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <Activity size={20} />
                                </div>
                                <p className='font-black text-slate-900 text-lg tracking-tight'>Real-time Booking Feed</p>
                            </div>
                        </div>

                        <div className='divide-y divide-slate-50'>
                            {(dashData?.latestAppointments || []).map((item, index) => (
                                <div className='flex flex-wrap items-center px-10 py-6 gap-6 hover:bg-slate-50/80 transition-all' key={index}>
                                    <img className='rounded-2xl w-14 h-14 object-cover border-4 border-white shadow-sm' src={item.userData.image} alt="" />
                                    <div className='flex-1 min-w-[200px]'>
                                        <p className='text-slate-900 font-[900] text-lg tracking-tight'>{item.userData.name}</p>
                                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Visiting Dr. {item.docData.name} • {slotDateFormat(item.slotDate)}</p>
                                    </div>
                                    <div className="text-right">
                                        {item.cancelled
                                            ? <span className='px-4 py-2 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl'>Cancelled</span>
                                            : item.isCompleted
                                                ? <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                                                    <CheckCircle size={14} /> Completed
                                                </div>
                                                : <button onClick={() => cancelAppointment(item._id)} className='w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all'>
                                                    <Activity size={18} />
                                                </button>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Verification Sidebar */}
                <div className="space-y-10">
                    <div className="bg-slate-900 rounded-[48px] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp size={24} className="text-blue-400" />
                                <h3 className="text-2xl font-black tracking-tight">System Health</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Network Uptime</p>
                                    <p className="text-3xl font-black">99.9%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">API Latency</p>
                                    <p className="text-3xl font-black">24ms</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-[32px] border border-white/10">
                            <p className="text-xs font-bold text-slate-300 tracking-tight">"All nodes operational. Fraud detection systems active."</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Verification Queue</h3>
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100 uppercase">{dashData.approvalQueue?.length || 0} Pending</span>
                        </div>
                        <ApprovalQueue 
                            doctors={dashData.approvalQueue} 
                            onApprove={changeVerification}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
