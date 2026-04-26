import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { doctors as initialDoctors } from '../assets/assets_frontend/assets';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [profileData, setProfileData] = useState(false);
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dtoken: dToken } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dtoken: dToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dtoken: dToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dtoken: dToken } });
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dtoken: dToken } });
            if (data.success) {
                const doc = data.profileData;
                const assetDoc = initialDoctors.find(m => m.name === doc.name);
                const fallbackImage = assetDoc?.image || '';
                
                if (!doc.image || doc.image.includes('/src/assets/') || doc.image.includes('\\src\\assets\\')) {
                    setProfileData({ ...doc, image: fallbackImage });
                } else {
                    setProfileData(doc);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const value = {
        dToken,
        setDToken,
        backendUrl,
        appointments,
        setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,
        setDashData,
        getDashData,
        profileData,
        setProfileData,
        getProfileData
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
