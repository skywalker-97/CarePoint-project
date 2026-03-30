import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';

const Home = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    return (
        <div>
            {/* Hero Section */}
            <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
                {/* Left Side */}
                <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                    <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                        Book Appointment <br /> With Trusted Doctors
                    </p>
                    <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                        <img className='w-28' src={assets.group_profiles} alt="profiles" />
                        <p>Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
                    </div>
                    <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
                        Book appointment <img className='w-3' src={assets.arrow_icon} alt="arrow" />
                    </a>
                </div>
                {/* Right Side */}
                <div className='md:w-1/2 relative'>
                    <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="header image" />
                </div>
            </div>

            {/* Speciality Section Placeholder */}
            <div id="speciality" className='flex flex-col items-center gap-4 py-16 text-gray-800'>
                <h1 className='text-3xl font-medium'>Find by Speciality</h1>
                <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            </div>

            {/* Top Doctors Section */}
            <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
                <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
                <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
                <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                    {doctors.slice(0, 10).map((item, index) => (
                        <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0,0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                            {(item.image || item.fallbackImage) ? (
                                <img
                                    className='bg-blue-50 w-full h-48 object-cover'
                                    src={item.image || item.fallbackImage}
                                    alt={item.name}
                                    onError={(e) => {
                                        if (item.fallbackImage && e.currentTarget.src !== item.fallbackImage) {
                                            e.currentTarget.src = item.fallbackImage;
                                        }
                                    }}
                                />
                            ) : <div className='bg-blue-50 w-full h-48 flex items-center justify-center text-primary font-bold text-4xl'>{item.name.charAt(0)}</div>}
                            <div className='p-4'>
                                <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                    <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                                </div>
                                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                <p className='text-gray-600 text-sm'>{item.speciality}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => navigate('/doctors')} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
            </div>
        </div>
    );
};

export default Home;
