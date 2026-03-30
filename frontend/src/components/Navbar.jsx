import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { DoctorContext } from '../context/DoctorContext';
import { assets } from '../assets/assets_frontend/assets';

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken, userData } = useContext(AppContext);
    const { dToken, setDToken, profileData } = useContext(DoctorContext);
    
    // For mobile menu
    const [showMenu, setShowMenu] = useState(false);

    const logout = () => {
        if (token) {
            setToken(false);
            localStorage.removeItem('token');
        }
        if (dToken) {
            setDToken('');
            localStorage.removeItem('dToken');
        }
        navigate('/login');
    };

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <div onClick={() => navigate('/')} className='cursor-pointer text-2xl font-bold text-primary flex items-center gap-2'>
                <img className='w-44' src={assets.logo} alt="CarePoint Logo" />
            </div>
            
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/' className={({isActive}) => isActive ? "text-primary pb-1 border-b-2 border-primary" : "text-gray-600 pb-1 hover:text-primary transition-all"}>
                    <li className='py-1'>HOME</li>
                </NavLink>
                <NavLink to='/doctors' className={({isActive}) => isActive ? "text-primary pb-1 border-b-2 border-primary" : "text-gray-600 pb-1 hover:text-primary transition-all"}>
                    <li className='py-1'>ALL DOCTORS</li>
                </NavLink>
                <NavLink to='/about' className={({isActive}) => isActive ? "text-primary pb-1 border-b-2 border-primary" : "text-gray-600 pb-1 hover:text-primary transition-all"}>
                    <li className='py-1'>ABOUT</li>
                </NavLink>
                <NavLink to='/contact' className={({isActive}) => isActive ? "text-primary pb-1 border-b-2 border-primary" : "text-gray-600 pb-1 hover:text-primary transition-all"}>
                    <li className='py-1'>CONTACT</li>
                </NavLink>
                <button onClick={() => navigate('/admin-login')} className='border border-gray-300 rounded-full px-4 py-1.5 text-xs text-gray-700 font-medium hover:bg-gray-100 transition-all'>
                    Admin Panel
                </button>
            </ul>
            <div className='flex items-center gap-4'>
                {token && userData ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <div className='w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center text-primary font-bold'>{userData.name.charAt(0)}</div>
                        <img className='w-2.5' src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E" alt="dropdown" />
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : dToken ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <div className='w-8 h-8 rounded-full bg-blue-100 flex justify-center items-center text-primary font-bold'>{profileData ? profileData.name.charAt(0) : 'D'}</div>
                        <img className='w-2.5' src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E" alt="dropdown" />
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-40 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                <p onClick={() => navigate('/doctor-profile')} className='hover:text-black cursor-pointer'>Doctor Profile</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex gap-4 font-medium'>
                         <button onClick={() => navigate('/login', { state: { mode: 'Login' } })} className='text-gray-600 hover:text-primary transition-all pr-4 border-r'>Login</button>
                         <button onClick={() => navigate('/login', { state: { mode: 'Sign Up' } })} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-opacity-90 transition-all'>
                            Create account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
