import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Chat from '../components/Chat';
import { Calendar, MapPin, Clock, ChevronRight, MessageSquare, X, CheckCircle2, AlertCircle, CreditCard, User, Star, FileText, History, Activity, ShieldCheck, Zap } from 'lucide-react';
import ReviewModal from '../components/ReviewModal';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HealthSummaryCard from '../components/dashboard/HealthSummaryCard';
import MedicalRecordsTimeline from '../components/dashboard/MedicalRecordsTimeline';
import PaymentModal from '../components/PaymentModal';
import { getDoctorImage } from '../utils/imageHelper';

const MyAppointments = () => {
    const { backendUrl, token, getDoctorsData, userData, currencySymbol, doctors } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [records, setRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'records'
    const [chatConfig, setChatConfig] = useState(null);
    const [reviewConfig, setReviewConfig] = useState(null); // { doctorId, doctorName, appointmentId }
    const [paymentConfig, setPaymentConfig] = useState(null); // { appointmentId, amount, doctorName }
    const [healthTip, setHealthTip] = useState('');
    const [loadingTip, setLoadingTip] = useState(false);
    const navigate = useNavigate();

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getMedicalRecords = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/medical-history', { headers: { token } });
            if (data.success) {
                setRecords(data.prescriptions);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
                getDoctorsData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const downloadPrescription = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/prescription/download', { appointmentId });
            if (data.success) {
                const linkSource = `data:application/pdf;base64,${data.pdfBase64}`;
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.download = `Medical_Report_${appointmentId}.pdf`;
                downloadLink.click();
                toast.success("Report downloaded!");
            } else {
                toast.info("Report is being processed.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Download failed");
        }
    };

    const downloadInvoice = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/invoice/download', { appointmentId }, { headers: { token } });
            if (data.success) {
                const linkSource = `data:application/pdf;base64,${data.pdfBase64}`;
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.download = `Invoice_${appointmentId}.pdf`;
                downloadLink.click();
                toast.success("Invoice downloaded!");
            } else {
                toast.info("Invoice not available.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Download failed");
        }
    };

    const submitReview = async (rating, comment) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/review/add',
                { appointmentId: reviewConfig.appointmentId, rating, comment },
                { headers: { token } }
            );
            if (data.success) {
                toast.success("Review submitted!");
                setReviewConfig(null);
                getUserAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to submit review");
        }
    };

    const handlePaymentSuccess = async (transactionId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/verify-payment',
                { appointmentId: paymentConfig.appointmentId, transactionId },
                { headers: { token } }
            );
            if (data.success) {
                toast.success("Payment Verified!");
                setPaymentConfig(null);
                getUserAppointments();
                if (getDoctorsData) getDoctorsData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Verification failed");
        }
    };

    const getAIHealthTip = async () => {
        if (!userData) return;
        setLoadingTip(true);
        try {
            const { data } = await axios.post(backendUrl + '/api/ai/health-tip', { userData }, { headers: { token } });
            if (data.success) {
                setHealthTip(data.tip);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingTip(false);
        }
    };

    useEffect(() => {
        if (token) {
            getUserAppointments();
            getMedicalRecords();
            getAIHealthTip();
        }
    }, [token]);

    const stats = {
        totalAppointments: (appointments || []).length,
        activePrescriptions: (records || []).length,
        completedVisits: (appointments || []).filter(a => a.isCompleted).length,
        healthScore: userData?.profileCompleted || 85
    };

    return (
        <div className='max-w-7xl mx-auto px-6 py-12 space-y-12 font-inter'>
            {/* Page Header */}
            <header className='flex flex-col md:flex-row md:items-center justify-between gap-8'>
                <div className='space-y-3'>
                    <div className='flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.4em]'>
                        <Activity size={14} /> Patient Health Dashboard
                    </div>
                    <h1 className='text-4xl md:text-5xl font-black text-slate-900 tracking-tight'>Welcome, {(userData?.name || "Patient").split(' ')[0]}</h1>
                    <p className='text-slate-400 font-medium max-w-md leading-relaxed'>
                        Track your recovery, manage appointments, and access your digital medical records.
                    </p>
                </div>
                <div className='flex items-center gap-4 bg-slate-900 text-white px-8 py-5 rounded-[32px] shadow-2xl shadow-slate-900/20'>
                    <div className='w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center'>
                        <ShieldCheck size={24} className="text-blue-400" />
                    </div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>Account Security</p>
                        <p className='text-sm font-black'>HIPAA Compliant</p>
                    </div>
                </div>
            </header>

            {/* AI Health Tip Card */}
            {healthTip && (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-[40px] p-10 border border-primary/10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group'
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000" />
                    <div className='w-20 h-20 bg-white rounded-[28px] shadow-premium flex items-center justify-center flex-shrink-0 relative z-10'>
                        <Zap size={32} className="text-primary fill-primary animate-pulse" />
                    </div>
                    <div className='space-y-3 relative z-10 flex-1'>
                        <p className='text-[10px] font-black text-primary uppercase tracking-[0.4em]'>AI Health Intelligence</p>
                        <h2 className='text-xl font-black text-slate-900 tracking-tight'>Daily Wellness Insight</h2>
                        <p className='text-slate-600 font-medium leading-relaxed italic'>"{healthTip}"</p>
                    </div>
                    <div className='flex-shrink-0 relative z-10'>
                        <button 
                            onClick={getAIHealthTip}
                            disabled={loadingTip}
                            className='px-6 py-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm'
                        >
                            {loadingTip ? 'Analyzing...' : 'Refresh Tip'}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Stats Overview */}
            <HealthSummaryCard stats={stats} />

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-[24px] w-fit border border-slate-100">
                <button 
                    onClick={() => setActiveTab('appointments')}
                    className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'appointments' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Upcoming Visits
                </button>
                <button 
                    onClick={() => setActiveTab('records')}
                    className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'records' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Medical Records
                </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode='wait'>
                {activeTab === 'appointments' ? (
                    <motion.div 
                        key="appointments-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className='space-y-6'
                    >
                        {(appointments || []).map((item, index) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={item._id} 
                                className='group relative bg-white/80 backdrop-blur-xl rounded-[48px] border border-slate-100 p-8 md:p-10 flex flex-col lg:flex-row gap-10 hover:shadow-premium transition-all duration-500'
                            >
                                {/* Doctor Profile Section */}
                                <div className='flex flex-col sm:flex-row gap-8 lg:flex-1'>
                                    <div className='w-full sm:w-48 h-48 bg-slate-50 rounded-[40px] overflow-hidden shadow-inner flex-shrink-0 relative'>
                                        <img 
                                            className='w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700' 
                                            src={getDoctorImage(doctors.find(d => d._id === item.docId) || item.docData)} 
                                            alt={item.docData.name} 
                                        />
                                        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                                    </div>
                                    
                                    <div className='space-y-6 flex-1 flex flex-col justify-center'>
                                        <div>
                                            <span className='px-4 py-1.5 bg-blue-50/50 text-primary text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100/30'>
                                                {item.docData.speciality}
                                            </span>
                                            <h3 className='text-3xl font-black text-slate-800 tracking-tight mt-3'>
                                                {item.docData.name}
                                            </h3>
                                        </div>
                                        
                                        <div className='space-y-4'>
                                            <div className='flex items-center gap-6'>
                                                <div className='flex items-center gap-3 text-slate-800 bg-slate-50/50 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm'>
                                                    <Clock size={16} className="text-primary" />
                                                    <p className='text-xs font-black uppercase tracking-widest'>
                                                        {item.slotDate} <span className="text-slate-200 mx-2">•</span> {item.slotTime}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className='flex flex-col gap-4 justify-center lg:w-72'>
                                    {(!item.cancelled && !item.isCompleted) ? (
                                        <>
                                            {!item.payment ? (
                                                <button 
                                                    onClick={() => setPaymentConfig({ appointmentId: item._id, amount: item.amount, doctorName: item.docData.name })}
                                                    className='w-full py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-4 group'
                                                >
                                                    <CreditCard size={18} /> Pay & Book <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            ) : (
                                                <div className='w-full p-5 bg-emerald-50 text-emerald-600 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-emerald-100'>
                                                    <CheckCircle2 size={18} /> Paid Successfully
                                                </div>
                                            )}
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <button 
                                                    onClick={() => setChatConfig({ roomId: item._id, receiverName: item.docData.name })}
                                                    className='flex-1 flex items-center justify-center gap-3 py-4 border border-slate-100 bg-slate-50/30 text-slate-600 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm'
                                                >
                                                    <MessageSquare size={16} /> Chat
                                                </button>
                                                <button 
                                                    onClick={() => cancelAppointment(item._id)} 
                                                    className='flex-1 flex items-center justify-center gap-3 py-4 border border-slate-100 bg-slate-50/30 text-slate-600 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all active:scale-95 shadow-sm'
                                                >
                                                    <X size={16} /> Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : item.cancelled ? (
                                        <div className='w-full p-6 bg-rose-50/50 rounded-[32px] flex flex-col items-center text-center space-y-2 border border-rose-100/50'>
                                            <p className='text-[10px] font-black text-rose-500 uppercase tracking-widest'>Cancelled</p>
                                        </div>
                                    ) : (
                                        <div className='flex flex-col gap-3'>
                                            <div className='w-full p-6 bg-emerald-50/50 rounded-[32px] flex flex-col items-center text-center space-y-2 border border-emerald-100/50'>
                                                <p className='text-[10px] font-black text-emerald-600 uppercase tracking-widest'>Completed</p>
                                            </div>
                                            <button 
                                                onClick={() => downloadPrescription(item._id)}
                                                className='w-full py-4 bg-primary text-white border border-primary rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3'
                                            >
                                                <FileText size={14} /> Download Report
                                            </button>
                                            <button 
                                                onClick={() => setReviewConfig({ appointmentId: item._id, doctorId: item.docId, doctorName: item.docData.name })}
                                                className='w-full py-4 bg-white border border-slate-100 rounded-[28px] font-black text-[10px] uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3'
                                            >
                                                <Star size={14} /> Review Specialist
                                            </button>
                                            {item.payment && (
                                                <button 
                                                    onClick={() => downloadInvoice(item._id)}
                                                    className='w-full py-4 bg-slate-50 text-slate-400 border border-slate-100 rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-3'
                                                >
                                                    <CreditCard size={14} /> Download Invoice
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {(appointments || []).length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No upcoming visits</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="records-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <MedicalRecordsTimeline records={records} onDownload={downloadPrescription} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Modal */}
            {chatConfig && userData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setChatConfig(null)} />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-2xl bg-white rounded-[60px] shadow-premium overflow-hidden"
                    >
                        <Chat 
                            roomId={chatConfig.roomId} 
                            receiverName={chatConfig.receiverName} 
                            onClose={() => setChatConfig(null)} 
                            senderId={userData._id}
                            senderModel="user"
                        />
                    </motion.div>
                </div>
            )}

            <ReviewModal 
                isOpen={!!reviewConfig}
                onClose={() => setReviewConfig(null)}
                onSubmit={submitReview}
                doctorName={reviewConfig?.doctorName}
            />

            {paymentConfig && (
                <PaymentModal 
                    isOpen={!!paymentConfig}
                    onClose={() => setPaymentConfig(null)}
                    onPaymentSuccess={handlePaymentSuccess}
                    amount={paymentConfig.amount}
                    doctorName={paymentConfig.doctorName}
                    currency={currencySymbol}
                />
            )}
        </div>
    );
};

export default MyAppointments;
