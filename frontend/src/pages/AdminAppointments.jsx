import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminAppointments = () => {

    const { aToken, appointments, getAllAppointments, backendUrl } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getAllAppointments();
        }
    }, [aToken]);

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } });
            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Appointments</p>
            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
                <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-200'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor Name</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>

                {appointments.map((item, index) => (
                    <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
                         <p className='max-sm:hidden'>{index + 1}</p>
                         <div className='flex items-center gap-2'>
                            <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-primary'>
                                {item.userData.name.charAt(0)}
                            </div> 
                            <p>{item.userData.name}</p>
                         </div>
                         <p className='max-sm:hidden'>N/A</p>
                         <p>{item.slotDate}, {item.slotTime}</p>
                         <div className='flex items-center gap-2'>
                            <p>{item.docData.name}</p>
                         </div>
                         <p>${item.amount}</p>
                         {item.cancelled ? (
                             <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                         ) : item.isCompleted ? (
                             <p className='text-green-500 text-xs font-medium'>Completed</p>
                         ) : 
                            <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='red' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='15' y1='9' x2='9' y2='15'%3E%3C/line%3E%3Cline x1='9' y1='9' x2='15' y2='15'%3E%3C/line%3E%3C/svg%3E" alt="cancel" />
                         }
                    </div>
                ))}

            </div>
        </div>
    );
};

export default AdminAppointments;
