import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { ChevronDown, User, LayoutDashboard, LogOut, Settings, Menu, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import NotificationBell from './NotificationBell';
import { getDoctorImage } from '../utils/imageHelper';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, setToken, userData, socket } = useContext(AppContext);
    const { dToken, setDToken, profileData } = useContext(DoctorContext);
    const { aToken, setAToken } = useContext(AdminContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = () => {
        setToken(false);
        setDToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('dToken');
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'All Doctors', path: '/doctors' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 px-6 py-3 ${
            isScrolled || showMenu ? 'bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] border-b border-slate-100/50' : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Premium Logo */}
                <div onClick={() => {navigate('/'); scrollTo(0,0)}} className="cursor-pointer flex items-center gap-3 group select-none">
                    {/* Icon */}
                    <div className="relative w-9 h-9 flex-shrink-0">
                        <div className="absolute inset-0 rounded-xl group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-teal-400/30"
                            style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0891B2 100%)' }}
                        />
                        {/* Medical Cross */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-5 h-5">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[5px] h-full bg-white rounded-full"/>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[5px] bg-white rounded-full"/>
                            </div>
                        </div>
                        {/* Glow ring on hover */}
                        <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                            style={{ background: 'radial-gradient(circle, #0D9488, transparent 70%)' }}
                        />
                    </div>
                    {/* Brand Text */}
                    <div className="flex flex-col leading-none">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] transition-colors duration-300"
                                style={{ color: '#0D9488' }}
                            >Healthcare</span>
                            {socket && socket.connected && (
                                <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[6px] font-black uppercase text-emerald-600 tracking-tighter">Live</span>
                                </div>
                            )}
                        </div>
                        <span className="font-black tracking-tight transition-colors duration-300"
                            style={{ fontSize: '18px', background: 'linear-gradient(90deg, #0D9488, #0891B2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >CarePoint</span>
                    </div>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <NavLink 
                            key={link.path} 
                            to={link.path} 
                            className={({isActive}) => `text-[13px] font-bold tracking-tight transition-all relative py-1 group ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`} />
                        </NavLink>
                    ))}
                </ul>

                {/* Right Side Actions */}
                <div className="flex items-center gap-5">
                    {token && userData ? (
                        <div className="flex items-center gap-4">
                            <NotificationBell token={token} type="user" />
                            <div className="relative group flex items-center gap-3 cursor-pointer bg-slate-50/80 hover:bg-white p-1 pr-4 rounded-full border border-slate-100 transition-all hover:shadow-sm">
                                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-white">
                                    {userData?.name ? userData.name.charAt(0) : 'U'}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[13px] font-bold text-slate-800 leading-tight">{userData?.name ? userData.name.split(' ')[0] : 'User'}</p>
                                </div>
                                <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform" />
                                
                                {/* Dropdown Menu */}
                                <div className="absolute top-full right-0 pt-3 z-[100] opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                                    <div className="bg-white/95 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 p-2 min-w-[240px]">
                                        <div className="px-5 py-4 border-b border-slate-50 mb-1">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Patient Portal</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">{userData?.name || 'User'}</p>
                                        </div>
                                        <div className="p-1 space-y-1">
                                            <button onClick={() => navigate('/my-profile')} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-primary rounded-2xl transition-all active:scale-95">
                                                <User size={18} className="opacity-70" /> My Profile
                                            </button>
                                            <button onClick={() => navigate('/my-appointments')} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-primary rounded-2xl transition-all active:scale-95">
                                                <LayoutDashboard size={18} className="opacity-70" /> Appointments
                                            </button>
                                            <div className="h-px bg-slate-50 mx-4 my-1" />
                                            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95">
                                                <LogOut size={18} className="opacity-70" /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : dToken ? (
                        <div className="flex items-center gap-4">
                            <NotificationBell token={dToken} type="doctor" />
                            <div className="relative group flex items-center gap-3 cursor-pointer bg-slate-50/80 hover:bg-white p-1 pr-4 rounded-full border border-slate-100 transition-all hover:shadow-sm">
                                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-white overflow-hidden">
                                    {profileData?.image ? (
                                        <img src={getDoctorImage(profileData)} alt={profileData?.name || "Doctor"} className="w-full h-full object-cover" />
                                    ) : (
                                        profileData?.name ? profileData.name.charAt(0) : 'D'
                                    )}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[13px] font-bold text-slate-800 leading-tight">
                                        {profileData?.name ? ((profileData.name.startsWith('Dr.') ? profileData.name.split(' ')[1] : profileData.name.split(' ')[0]) || profileData.name) : 'Doc'}
                                    </p>
                                </div>
                                <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform" />
                                
                                {/* Dropdown Menu */}
                                <div className="absolute top-full right-0 pt-3 z-[100] opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                                    <div className="bg-white/95 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 p-2 min-w-[240px]">
                                        <div className="px-5 py-4 border-b border-slate-50 mb-1">
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Doctor Portal</p>
                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                {profileData?.name ? (profileData.name.startsWith('Dr.') ? profileData.name : `Dr. ${profileData.name}`) : 'Doctor'}
                                            </p>
                                        </div>
                                        <div className="p-1 space-y-1">
                                            <button onClick={() => navigate('/doctor-profile')} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all active:scale-95">
                                                <Settings size={18} className="opacity-70" /> Settings
                                            </button>
                                            <button onClick={() => navigate('/doctor-dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all active:scale-95">
                                                <LayoutDashboard size={18} className="opacity-70" /> Dashboard
                                            </button>
                                            <div className="h-px bg-slate-50 mx-4 my-1" />
                                            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95">
                                                <LogOut size={18} className="opacity-70" /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : aToken ? (
                        <div className="flex items-center gap-4">
                            <NotificationBell token={aToken} type="admin" />
                            <div onClick={() => navigate('/admin-dashboard')} className="px-6 py-2 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                                Admin Dashboard
                            </div>
                            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-all">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                             <button onClick={() => navigate('/admin-login')} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all mr-2">Admin Portal</button>
                             <button onClick={() => navigate('/login', { state: { mode: 'Login' } })} className="text-[13px] font-bold text-slate-500 hover:text-primary transition-all">Sign In</button>
                             <button onClick={() => navigate('/login', { state: { mode: 'Sign Up' } })} className="px-7 py-3 bg-primary text-white rounded-full text-[13px] font-bold shadow-xl shadow-blue-500/25 hover:scale-[1.05] active:scale-[0.98] transition-all">Create Account</button>
                        </div>
                    )
                }

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        {showMenu ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {showMenu && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-slate-50 flex flex-col p-8 space-y-6"
                    >
                        {navLinks.map((link) => (
                            <NavLink key={link.path} to={link.path} onClick={() => setShowMenu(false)} className={({isActive}) => `text-xl font-black ${isActive ? 'text-primary' : 'text-slate-900'}`}>
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="h-px bg-slate-100" />
                        {!token && !dToken && (
                            <button onClick={() => {navigate('/login'); setShowMenu(false)}} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg">Get Started</button>
                        )}
                        <button onClick={() => {navigate('/admin-login'); setShowMenu(false)}} className="w-full py-3 text-slate-400 font-bold text-sm">Admin Portal</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};


export default Navbar;
