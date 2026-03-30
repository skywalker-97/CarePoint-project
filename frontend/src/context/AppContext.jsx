import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { doctors as initialDoctors } from "../assets/assets_frontend/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [userData, setUserData] = useState(false);

    // Fetch doctors from backend
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list');
            if (data.success) {
                setDoctors(data.doctors);
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

    // Use initialDoctors from assets as fallback/mock
    const mockDoctors = initialDoctors;

    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(false);
        }
    }, [token]);

    // Map backend doctors to asset images if name matches and image is missing/invalid
    const getEnhancedDoctors = () => {
        const baseDoctors = doctors.length > 0 ? doctors : mockDoctors;
        return baseDoctors.map(doc => {
            const assetDoc = mockDoctors.find(m => m.name === doc.name);
            const fallbackImage = assetDoc?.image || '';

            const imageValue = typeof doc.image === 'string' ? doc.image : '';
            const isLikelyLocalDevPath = imageValue.includes('/src/assets/') || imageValue.includes('\\src\\assets\\') || imageValue.startsWith('file:') || /^[A-Za-z]:\\/.test(imageValue);

            if (!imageValue || isLikelyLocalDevPath) {
                return { ...doc, image: fallbackImage, fallbackImage };
            }

            return { ...doc, fallbackImage };
        });
    }

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
        doctors: getEnhancedDoctors(), 
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
        calculateAge
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
