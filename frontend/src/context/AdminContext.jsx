import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { enhanceDoctorsWithImages } from '../utils/imageHelper';
import { AppContext } from "./AppContext";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const { socket } = useContext(AppContext);
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    // Socket listeners for admin
    useEffect(() => {
        if (aToken && socket) {
            socket.emit('join_admin');
            
            socket.on('notification', (data) => {
                // Refresh data for admin
                if (data.type === 'appointment' || data.type === 'registration') {
                    getAllAppointments();
                    getDashData();
                    getAllDoctors();
                }
            });
        }

        return () => {
            if (socket) socket.off('notification');
        };
    }, [aToken, socket]);

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { atoken: aToken } });
            if (data.success) {
                setDoctors(enhanceDoctorsWithImages(data.doctors));
                console.log(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAllAppointments = async () => {
        try {
             const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { atoken: aToken } });
             if (data.success) {
                 setAppointments(data.appointments);
             } else {
                 toast.error(data.message);
             }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { atoken: aToken } });
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { atoken: aToken } });
            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { atoken: aToken } });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const changeVerification = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-verification', { docId }, { headers: { atoken: aToken } });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        appointments,
        setAppointments,
        getAllAppointments,
        dashData,
        getDashData,
        cancelAppointment,
        changeAvailability,
        changeVerification
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
