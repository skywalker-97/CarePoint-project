import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";
import { enhanceDoctorsWithImages } from '../utils/imageHelper';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    
    const socket = useMemo(() => io(backendUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    }), [backendUrl]);
    
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [userData, setUserData] = useState(null);

    const [onlineDoctors, setOnlineDoctors] = useState(new Set());

    // Socket listeners and room management
    useEffect(() => {
        if (userData?._id) {
            socket.emit('join', userData._id);
            
            // Check if user is a doctor
            if (userData.isDoctor) {
                socket.emit('doctor_online', userData._id);
            }
        }
        
        socket.on('notification', (data) => {
            toast.info(data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            // Refresh data based on notification type
            if (data.type === 'appointment') {
                // If on appointments page, refresh
                // This will be handled by individual components listening or context
            }
        });

        socket.on('online_doctors_list', (doctorIds) => {
            setOnlineDoctors(new Set(doctorIds));
        });

        socket.on('doctor_status_update', ({ docId, status }) => {
            setOnlineDoctors(prev => {
                const next = new Set(prev);
                if (status === 'online') next.add(docId);
                else next.delete(docId);
                return next;
            });
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            socket.off('notification');
            socket.off('online_doctors_list');
            socket.off('doctor_status_update');
            socket.off('connect_error');
        };
    }, [userData, socket]);

    // Fetch doctors from backend
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list');
            if (data.success) {
                setDoctors(enhanceDoctorsWithImages(data.doctors));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // Fetch user profile from backend
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } });
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(null);
        }
    }, [token]);
    const currency = '₹';

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
    }

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    }

    const value = {
        doctors,
        currency,
        currencySymbol: '₹',
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
        getDoctorsData,
        slotDateFormat,
        calculateAge,
        socket,
        onlineDoctors
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
