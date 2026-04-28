import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../assets/assets_frontend/assets';
import ReviewList from '../components/ReviewList';
import { getDoctorImage } from '../utils/imageHelper';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
    
    // Store days
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const navigate = useNavigate();

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    const fetchDocInfo = async () => {
        const docInfo = (doctors || []).find((doc) => doc._id === docId);
        setDocInfo(docInfo);
    };

    const getAvailableSlots = async () => {
        setDocSlots([]);

        // Geting current date
        let today = new Date();

        for(let i=0 ; i<7 ; i++) {
            // getting date within index
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // setting end time of the date
            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];
            while(currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // check if the slot is booked
                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();
                const slotDate = `${day}_${month}_${year}`;

                const isSlotAvailable = docInfo?.slots_booked && docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(formattedTime) ? false : true;

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    });
                }
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            setDocSlots(prev => ([...prev, timeSlots]));
        }
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Login to book appointment');
            return navigate('/login');
        }

        try {
            if (!docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
                return toast.warn('No slots available for this date.');
            }

            const date = docSlots[slotIndex][0].datetime;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            const slotDate = `${day}_${month}_${year}`;

            if (!slotTime) {
                return toast.warn('Please select a time slot.');
            }

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                if (getDoctorsData) getDoctorsData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const fetchReviews = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/review/get-doctor-reviews', { docId });
            if (data.success) {
                setReviews(data.reviews);
                setAverageRating(data.averageRating);
                setReviewCount(data.reviewCount);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo();
            fetchReviews();
        }
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    if (!docInfo) return <div className='py-5'>Loading...</div>;

    return (
        <div className='max-w-6xl mx-auto px-4 sm:px-6 py-6'>
            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-6 items-start'>

                {/* Doctor Image — transparent bg with soft gradient */}
                <div className='w-full sm:w-72 flex-shrink-0'>
                    <div className='relative w-full sm:w-72 rounded-3xl overflow-hidden shadow-2xl shadow-teal-100'
                        style={{
                            background: 'linear-gradient(145deg, rgba(204,251,241,0.5) 0%, rgba(240,253,250,0.35) 50%, rgba(255,255,255,0.1) 100%)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(20,184,166,0.2)',
                        }}
                    >
                        <img
                            className='w-full object-cover object-top'
                            style={{ minHeight: '280px', maxHeight: '340px' }}
                            src={getDoctorImage(docInfo)}
                            alt={docInfo?.name || "Doctor"}
                            onError={(e) => {
                                e.currentTarget.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                            }}
                        />
                        {/* Subtle bottom fade */}
                        <div className='absolute bottom-0 left-0 right-0 h-16'
                            style={{ background: 'linear-gradient(to top, rgba(240,253,250,0.7), transparent)' }}
                        />
                        {/* Available badge */}
                        <div className='absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full'
                            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.6)' }}
                        >
                            <div className={`w-2 h-2 rounded-full ${docInfo.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span className='text-[9px] font-black uppercase tracking-widest text-slate-700'>
                                {docInfo.available ? 'Available' : 'Busy'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Doctor Info Card */}
                <div className='flex-1 border border-gray-100 rounded-3xl p-6 sm:p-8 bg-white shadow-lg shadow-blue-50/80'>
                    {/* Name & Verified */}
                    <div className='flex flex-wrap items-center gap-2 mb-2'>
                        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>{docInfo.name}</h1>
                        <img className='w-5 h-5' src={assets.verified_icon} alt="Verified Icon" />
                    </div>

                    {/* Degree & Speciality */}
                    <div className='flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3'>
                        <p className='font-medium'>{docInfo.degree || "N/A"} - {docInfo.speciality || "Specialist"}</p>
                        <span className='py-0.5 px-3 border border-gray-200 text-[10px] font-bold rounded-full bg-gray-50 uppercase tracking-wider'>
                            {docInfo.experience || "New"}
                        </span>
                    </div>

                    {/* Email */}
                    <div className='flex items-center gap-2 text-sm text-gray-500 font-medium mb-4'>
                        <span className='font-bold text-gray-700'>Email:</span>
                        <a href={`mailto:${docInfo.email}`} className='text-primary hover:underline break-all'>{docInfo.email}</a>
                    </div>

                    {/* Doc About */}
                    <div className='border-t border-gray-50 pt-4'>
                        <p className='flex items-center gap-1 text-sm font-bold text-gray-800 uppercase tracking-widest mb-2'>
                            About <img className='w-3' src={assets.info_icon} alt="Info Icon" />
                        </p>
                        <p className='text-sm text-gray-500 leading-relaxed'>
                            {docInfo.about}
                        </p>
                    </div>

                    {/* Fee */}
                    <div className='mt-4 pt-4 border-t border-gray-50'>
                        <p className='text-gray-500 font-medium'>
                            Appointment fee: <span className='text-xl font-bold text-primary'>{currencySymbol}{docInfo.fees}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ------- Booking Slots ------- */}
            <div className='mt-10'>
                <p className='text-base font-bold text-gray-700 mb-4 uppercase tracking-widest text-[11px]'>Select Booking Slot</p>

                {/* Day Picker */}
                <div className='flex gap-3 items-center w-full overflow-x-auto pb-2'>
                    {docSlots.length > 0 && docSlots.map((item, index) => {
                        const dateForThisDay = new Date();
                        dateForThisDay.setDate(dateForThisDay.getDate() + index);
                        return (
                            <div
                                onClick={() => setSlotIndex(index)}
                                key={index}
                                className={`text-center py-5 min-w-[60px] rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center flex-shrink-0 ${slotIndex === index ? 'bg-primary text-white shadow-lg shadow-teal-200' : 'border border-gray-200 hover:bg-teal-50 hover:border-teal-200 bg-white'}`}
                            >
                                <p className='text-[10px] font-bold uppercase'>{daysOfWeek[dateForThisDay.getDay()]}</p>
                                <p className='mt-1 text-lg font-bold'>{dateForThisDay.getDate()}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Time Picker */}
                <div className='flex items-center gap-3 w-full overflow-x-auto mt-5 pb-4'>
                    {(docSlots || []).length > 0 && (docSlots[slotIndex] || []).length === 0 && (
                        <p className='text-gray-500 font-light text-sm'>No slots available for this date. Please select another day.</p>
                    )}
                    {(docSlots || []).length > 0 && (docSlots[slotIndex] || []).map((item, index) => (
                        <p
                            onClick={() => setSlotTime(item.time)}
                            key={index}
                            className={`text-sm font-medium flex-shrink-0 px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 ${item.time === slotTime ? 'bg-primary text-white shadow-md shadow-teal-200' : 'text-gray-500 border border-gray-200 hover:text-primary hover:border-primary bg-white'}`}
                        >
                            {item.time}
                        </p>
                    ))}
                </div>

                <button
                    onClick={bookAppointment}
                    className='mt-4 bg-primary text-white text-sm font-bold px-12 py-3.5 rounded-full hover:bg-teal-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-teal-200'
                >
                    Book an Appointment
                </button>
            </div>

            {/* ------- Reviews Section ------- */}
            <div className='mt-16 pb-20'>
                <ReviewList reviews={reviews} averageRating={averageRating} reviewCount={reviewCount} />
            </div>
        </div>
    );
};

export default Appointment;
