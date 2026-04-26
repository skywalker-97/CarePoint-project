import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_admin/assets';
import PrescriptionModal from '../components/PrescriptionModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FileText, CheckCircle, XCircle, History, Calendar } from 'lucide-react';
import PatientHistoryModal from '../components/PatientHistoryModal';

const DoctorAppointments = () => {

    const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
    const { currency, calculateAge, slotDateFormat, backendUrl } = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);

    const handleGeneratePrescription = async (prescriptionData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/prescription/generate', prescriptionData, { headers: { dToken } });
            if (data.success) {
                toast.success(data.message);
                setShowModal(false);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const fetchHistory = async (userId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/patient-history', { userId }, { headers: { dToken } });
            if (data.success) {
                setPatientHistory(data.prescriptions);
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
            getAppointments();
        }
    }, [dToken]);

    return (
        <div className='w-full max-w-6xl m-5 font-inter'>
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center'>
                    <Calendar size={20} />
                </div>
                <h1 className='text-2xl font-[900] text-slate-900 tracking-tight'>Appointment Management</h1>
            </div>

            <div className='bg-white border border-slate-100 rounded-[32px] text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-premium'>
                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.5fr] gap-1 py-5 px-8 border-b bg-slate-50/50'>
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>#</p>
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Patient</p>
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Payment</p>
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Age</p>
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Date & Time</p>
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Fees</p>
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest text-center'>Actions</p>
                </div>

                {
                    appointments.map((item, index) => (
                        <div className='flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.5fr] gap-1 items-center text-slate-600 py-5 px-8 border-b hover:bg-slate-50/80 transition-colors' key={index}>
                            <p className='max-sm:hidden font-bold'>{index + 1}</p>
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center gap-3'>
                                    <img className='w-10 h-10 rounded-xl bg-slate-100 object-cover' src={item.userData.image} alt="" />
                                    <p className='text-slate-900 font-black tracking-tight'>{item.userData.name}</p>
                                </div>
                                <button 
                                    onClick={() => { setSelectedAppointment(item); fetchHistory(item.userId); }}
                                    className='flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest hover:underline'
                                >
                                    <History size={10} /> View Medical History
                                </button>
                            </div>
                            <div>
                                <p className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline ${item.payment ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {item.payment ? 'Online' : 'CASH'}
                                </p>
                            </div>
                            <p className='max-sm:hidden font-bold'>{calculateAge(item.userData.dob)}</p>
                            <p className='font-bold text-slate-900'>{slotDateFormat(item.slotDate)}, <span className='text-primary'>{item.slotTime}</span></p>
                            <p className='font-black text-slate-900'>{currency}{item.amount}</p>
                            <div className='flex items-center justify-center gap-2'>
                                {
                                    item.cancelled
                                        ? <div className='flex items-center gap-1.5 text-rose-500 font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-rose-50 rounded-xl'>
                                            <XCircle size={14} /> Cancelled
                                          </div>
                                        : item.isCompleted
                                            ? <div className='flex flex-col gap-2 w-full'>
                                                <div className='flex items-center justify-center gap-1.5 text-emerald-500 font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-emerald-50 rounded-xl'>
                                                    <CheckCircle size={14} /> Completed
                                                </div>
                                                <button 
                                                    onClick={() => { setSelectedAppointment(item); setShowModal(true); }}
                                                    className='flex items-center justify-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-blue-50 rounded-xl hover:bg-primary hover:text-white transition-all'
                                                >
                                                    <FileText size={14} /> Prescription
                                                </button>
                                              </div>
                                            : <div className='flex items-center gap-3'>
                                                <button onClick={() => cancelAppointment(item._id)} className='p-2 hover:bg-rose-50 text-rose-400 hover:text-rose-500 rounded-xl transition-all'>
                                                    <XCircle size={24} />
                                                </button>
                                                <button onClick={() => completeAppointment(item._id)} className='p-2 hover:bg-emerald-50 text-emerald-400 hover:text-emerald-500 rounded-xl transition-all'>
                                                    <CheckCircle size={24} />
                                                </button>
                                              </div>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>

            {showModal && (
                <PrescriptionModal 
                    appointment={selectedAppointment} 
                    onClose={() => setShowModal(false)} 
                    onSave={handleGeneratePrescription} 
                />
            )}
            {showHistoryModal && (
                <PatientHistoryModal 
                    history={patientHistory}
                    patientName={selectedAppointment?.userData?.name}
                    onClose={() => setShowHistoryModal(false)}
                />
            )}
        </div>
    );
};

export default DoctorAppointments;
