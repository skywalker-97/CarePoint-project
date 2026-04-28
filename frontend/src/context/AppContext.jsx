import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";
import { enhanceDoctorsWithImages } from '../utils/imageHelper';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const socket = io(backendUrl);
    
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [userData, setUserData] = useState(null);

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

    const currency = '$';

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
        currencySymbol: '$',
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
        getDoctorsData,
        slotDateFormat,
        calculateAge,
        socket
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
