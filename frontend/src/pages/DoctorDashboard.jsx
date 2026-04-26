import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_admin/assets';
import Chat from '../components/Chat';
import PrescriptionModal from '../components/PrescriptionModal';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import { DollarSign, Users, Calendar, BarChart3, TrendingUp, CheckCircle, MessageSquare, History, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PatientHistoryModal from '../components/PatientHistoryModal';

const DoctorDashboard = () => {

    const { dToken, dashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext);
    const { currency, slotDateFormat, backendUrl } = useContext(AppContext);
    const [chatConfig, setChatConfig] = useState(null);
    const [prescriptionConfig, setPrescriptionConfig] = useState(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [patientHistory, setPatientHistory] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const fetchHistory = async (userId, name) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/patient-history', { userId }, { headers: { dToken } });
            if (data.success) {
                setPatientHistory(data.prescriptions);
                setSelectedPatient(name);
                setShowHistoryModal(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (dToken) {
            getDashData();
        }
    }, [dToken]);

    return dashData && (
        <div className='m-5 font-inter'>
            {/* Header section */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">Clinical Insights</h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Medical Board Performance Analytics</p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs font-black text-slate-400 uppercase">Profile Status</p>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            <p className="text-sm font-black text-slate-900">Verified Professional</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
                <StatCard 
                    title="Total Revenue" 
                    value={`${currency}${dashData.earnings}`} 
                    icon={DollarSign} 
                    trend="up" 
                    trendValue="12.5" 
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard 
                    title="Appointments" 
                    value={dashData.appointments} 
                    icon={Calendar} 
                    trend="up" 
                    trendValue="8.2" 
                    color="bg-indigo-50 text-indigo-600"
                />
                <StatCard 
                    title="Total Patients" 
                    value={dashData.patients} 
                    icon={Users} 
                    color="bg-teal-50 text-teal-600"
                />
                <StatCard 
                    title="Patient Retention" 
                    value={`${dashData.stats?.repeatRate}%`} 
                    icon={TrendingUp} 
                    color="bg-amber-50 text-amber-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart Section */}
                <div className="lg:col-span-2">
                    <RevenueChart data={dashData.chartData} currency={currency} />
                </div>

                {/* Efficiency Stats Sidebox */}
                <div className="bg-slate-900 rounded-[40px] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <BarChart3 size={20} className="text-blue-400" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">Performance</h3>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Success</p>
                                    <p className="text-xl font-black">{dashData.stats?.conversionRate}%</p>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${dashData.stats?.conversionRate}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appointment Completion</p>
                                    <p className="text-xl font-black">{dashData.stats?.completed} Visits</p>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-white/5 rounded-[32px] border border-white/10">
                        <p className="text-xs font-bold text-slate-300">"Excellent clinical performance this month. You've maintained a 95% satisfaction rate."</p>
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table Overhaul */}
            <div className='bg-white mt-10 rounded-[48px] border border-slate-100 shadow-premium overflow-hidden'>
                <div className='flex justify-between items-center px-10 py-8 bg-slate-50/50 border-b border-slate-100'>
                    <div className='flex items-center gap-3'>
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <History size={20} />
                        </div>
                        <p className='font-black text-slate-900 text-lg tracking-tight'>Latest Patient Interactions</p>
                    </div>
                </div>

                <div className='divide-y divide-slate-50'>
                    {
                        dashData.latestAppointments.map((item, index) => (
                            <div className='flex flex-wrap items-center px-10 py-6 gap-6 hover:bg-slate-50/80 transition-all group' key={index}>
                                <img className='rounded-2xl w-14 h-14 object-cover border-4 border-white shadow-sm' src={item.userData.image} alt="" />
                                <div className='flex-1 min-w-[200px]'>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className='text-slate-900 font-[900] text-lg tracking-tight'>{item.userData.name}</p>
                                        <button 
                                            onClick={() => fetchHistory(item.userId, item.userData.name)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-slate-100 hover:bg-primary hover:text-white rounded-lg transition-all"
                                            title="View History"
                                        >
                                            <History size={14} />
                                        </button>
                                    </div>
                                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>{slotDateFormat(item.slotDate)}</p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                {
                                    item.cancelled
                                        ? <span className='px-4 py-2 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl'>Cancelled</span>
                                        : item.isCompleted
                                            ? <div className='flex items-center gap-3'>
                                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                                                    <CheckCircle size={14} /> Completed
                                                </div>
                                                <button 
                                                    onClick={() => setPrescriptionConfig(item)}
                                                    className='text-[10px] bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all font-black uppercase tracking-widest shadow-blue'
                                                >
                                                    Prescription
                                                </button>
                                              </div>
                                            : <div className='flex items-center gap-3'>
                                                <button 
                                                    onClick={() => setChatConfig({ roomId: item._id, receiverName: item.userData.name, senderId: item.docId })}
                                                    className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100'
                                                >
                                                    <MessageSquare size={14} /> Consult
                                                </button>
                                                <div className="flex gap-2">
                                                    <button onClick={() => cancelAppointment(item._id)} className='w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-400 hover:text-rose-500 rounded-xl transition-all' title="Cancel">
                                                        <XCircle size={20} />
                                                    </button>
                                                    <button onClick={() => completeAppointment(item._id)} className='w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-400 hover:text-emerald-500 rounded-xl transition-all' title="Complete">
                                                        <CheckCircle size={20} />
                                                    </button>
                                                 </div>
                                             </div>
                                 }
                                 </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Modals */}
            {chatConfig && (
                <Chat 
                    roomId={chatConfig.roomId} 
                    receiverName={chatConfig.receiverName} 
                    onClose={() => setChatConfig(null)} 
                    senderId={chatConfig.senderId}
                    senderModel="doctor"
                />
            )}

            {prescriptionConfig && (
                <PrescriptionModal 
                    appointment={prescriptionConfig}
                    onClose={() => setPrescriptionConfig(null)}
                    onSave={() => { getDashData(); setPrescriptionConfig(null); }}
                />
            )}

            {showHistoryModal && (
                <PatientHistoryModal 
                    history={patientHistory}
                    patientName={selectedPatient}
                    onClose={() => setShowHistoryModal(false)}
                />
            )}
        </div>
    );
};

export default DoctorDashboard;
