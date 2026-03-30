import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {

    const { backendUrl, token, getDoctorsData } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);

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
    }

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
    }

    // fallback mock data
    const mockAppointments = [
        {
            _id: '1',
            docData: { name: 'Dr. Richard James', speciality: 'General physician' },
            slotDate: '25_02_2026',
            slotTime: '10:00 AM',
            cancelled: false,
            isCompleted: false
        }
    ];

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    const displayAppointments = appointments.length > 0 ? appointments : (!token ? mockAppointments : []);

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-300'>My appointments</p>
            <div>
                {displayAppointments.map((item, index) => (
                    <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-gray-200' key={index}>
                        <div>
                            <div className='w-32 h-32 bg-indigo-50 flex items-center justify-center rounded'>
                                <span className='text-3xl font-bold text-primary'>{item.docData.name.charAt(0)}</span>
                            </div>
                        </div>
                        <div className='flex-1 text-sm text-zinc-600'>
                            <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                            <p className='text-xs'>{item.docData.address?.line1}</p>
                            <p className='text-xs'>{item.docData.address?.line2}</p>
                            <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {item.slotDate} | {item.slotTime}</p>
                        </div>
                        <div className='flex flex-col gap-2 justify-end'>
                            {!item.cancelled && !item.isCompleted && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                            {item.cancelled && <button className='text-sm text-red-500 sm:min-w-48 py-2 border border-red-500 rounded' disabled>Appointment cancelled</button>}
                            {item.isCompleted && <button className='text-sm text-green-500 sm:min-w-48 py-2 border border-green-500 rounded' disabled>Completed</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyAppointments;
