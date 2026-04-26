import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { DoctorContext } from '../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, Mail, Lock, Phone, Calendar, MapPin, CheckCircle2, ChevronDown } from 'lucide-react';

const Login = () => {
    const { backendUrl, token, setToken } = useContext(AppContext);
    const { dToken, setDToken } = useContext(DoctorContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Core States
    const [state, setState] = useState('Sign Up');
    const [loginMode, setLoginMode] = useState('Patient'); // 'Patient' or 'Doctor'
    const [step, setStep] = useState(1);

    // Form Data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('Male');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');

    useEffect(() => {
        if (location.state && location.state.mode) {
            setState(location.state.mode);
        }
    }, [location]);

    const nextStep = () => {
        if (step === 1) {
            if (!name || !email || !password) return toast.warning("Please fill all initial details");
            if (password.length < 8) return toast.warning("Password must be at least 8 characters");
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (state === 'Sign Up') {
                const registrationData = {
                    name, email, password, phone, dob, gender,
                    address: JSON.stringify({ line1: addressLine1, line2: addressLine2 })
                };
                const { data } = await axios.post(backendUrl + '/api/user/register', registrationData);
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    toast.success("Account successfully created!");
                } else {
                    toast.error(data.message);
                }
            } else {
                if (loginMode === 'Patient') {
                    const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
                    if (data.success) {
                        localStorage.setItem('token', data.token);
                        setToken(data.token);
                        toast.success("Logged in successfully!");
                    } else {
                        toast.error(data.message);
                    }
                } else {
                    const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password });
                    if (data.success) {
                        localStorage.setItem('dToken', data.token);
                        setDToken(data.token);
                        toast.success("Doctor logged in successfully!");
                    } else {
                        toast.error(data.message);
                    }
                }
            }
        } catch (error) {
            toast.error("Network Error: " + error.message);
        }
    };

    useEffect(() => {
        if (token || dToken) {
            navigate('/');
        }
    }, [token, dToken]);

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className='min-h-screen pt-24 pb-20 flex items-center justify-center px-6 relative overflow-hidden bg-slate-50'>
             {/* Background Decor */}
             <div className="absolute top-0 right-0 -z-10 opacity-30 transform translate-x-1/4 -translate-y-1/4">
                <div className="w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-[180px]" />
            </div>
            <div className="absolute bottom-0 left-0 -z-10 opacity-30 transform -translate-x-1/4 translate-y-1/4">
                <div className="w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[140px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='w-full max-w-xl bg-white/80 backdrop-blur-3xl rounded-[60px] border border-white shadow-premium p-10 md:p-14 relative'
            >
                {/* Role Switcher */}
                <div className='flex justify-center mb-12'>
                    <div className='bg-slate-100/50 p-1.5 rounded-[24px] flex gap-1 border border-slate-200/40 shadow-inner w-full md:w-auto'>
                        <button 
                            onClick={() => { setLoginMode('Patient'); setStep(1); }}
                            className={`flex-1 md:flex-none px-10 py-3.5 rounded-[18px] font-black text-xs uppercase tracking-widest transition-all duration-500 ${loginMode === 'Patient' ? 'bg-white text-primary shadow-xl shadow-blue-500/10' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Patient
                        </button>
                        <button 
                            onClick={() => { setLoginMode('Doctor'); setState('Login'); setStep(1); }}
                            className={`flex-1 md:flex-none px-10 py-3.5 rounded-[18px] font-black text-xs uppercase tracking-widest transition-all duration-500 ${loginMode === 'Doctor' ? 'bg-white text-primary shadow-xl shadow-blue-500/10' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Doctor
                        </button>
                    </div>
                </div>

                <div className='text-center mb-12 space-y-3'>
                    <h2 className='text-4xl font-black text-slate-900 tracking-tight'>
                        {state === 'Sign Up' ? 'Create Account' : loginMode === 'Doctor' ? 'Doctor Login' : 'Welcome Back'}
                    </h2>
                    <p className='text-slate-400 font-medium'>
                        {state === 'Sign Up' ? 'Experience world-class healthcare today.' : 'Sign in to access your secure portal.'}
                    </p>
                </div>

                {/* Step Indicators */}
                {state === 'Sign Up' && (
                    <div className='flex items-center justify-center mb-14 px-4'>
                        {[1, 2, 3].map((s) => (
                            <React.Fragment key={s}>
                                <div className={`relative flex flex-col items-center group`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 border-2 ${step === s ? 'bg-primary border-primary text-white shadow-2xl shadow-blue-500/40 scale-110' : step > s ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                                        {step > s ? <CheckCircle2 size={24} fill="currentColor" className="text-white" /> : s}
                                    </div>
                                    <span className={`absolute -bottom-8 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${step === s ? 'text-primary opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`}>
                                        Step {s}
                                    </span>
                                </div>
                                {s < 3 && (
                                    <div className='flex-1 mx-4 h-[2px] bg-slate-100 overflow-hidden rounded-full'>
                                        <div className={`h-full bg-primary transition-all duration-700 ease-out ${step > s ? 'w-full' : 'w-0'}`} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                <form onSubmit={onSubmitHandler} className='space-y-8'>
                    <AnimatePresence mode='wait'>
                        {step === 1 && (
                            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className='space-y-5'>
                                {state === 'Sign Up' && (
                                    <div className='relative group'>
                                        <User className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors' size={20} />
                                        <input 
                                            className='w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-primary focus:shadow-xl focus:shadow-blue-500/5 transition-all outline-none' 
                                            placeholder='Full Name' type="text" onChange={(e) => setName(e.target.value)} value={name} required={state === 'Sign Up'} 
                                        />
                                    </div>
                                )}
                                <div className='relative group'>
                                    <Mail className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors' size={20} />
                                    <input 
                                        className='w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-primary focus:shadow-xl focus:shadow-blue-500/5 transition-all outline-none' 
                                        placeholder='Email Address' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required 
                                    />
                                </div>
                                <div className='relative group'>
                                    <Lock className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors' size={20} />
                                    <input 
                                        className='w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-primary focus:shadow-xl focus:shadow-blue-500/5 transition-all outline-none' 
                                        placeholder='Password' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required 
                                    />
                                    {state === 'Sign Up' && <p className='absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest'>Min. 8 Chars</p>}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && state === 'Sign Up' && (
                            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className='space-y-5'>
                                <div className='relative group'>
                                    <Phone className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors' size={20} />
                                    <input 
                                        className='w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-primary focus:shadow-xl focus:shadow-blue-500/5 transition-all outline-none' 
                                        placeholder='Phone Number' type="tel" onChange={(e) => setPhone(e.target.value)} value={phone} required 
                                    />
                                </div>
                                <div className='relative group'>
                                    <Calendar className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors' size={20} />
                                    <input 
                                        className='w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl font-bold text-slate-700 focus:bg-white focus:border-primary focus:shadow-xl focus:shadow-blue-500/5 transition-all outline-none' 
                                        type="date" onChange={(e) => setDob(e.target.value)} value={dob} required 
                                    />
                                </div>
                                <div className='relative group'>
                                    <select 
                                        className='w-full px-6 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl font-black text-slate-700 appearance-none cursor-pointer focus:bg-white focus:border-primary transition-all outline-none'
                                        onChange={(e) => setGender(e.target.value)} value={gender}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown className='absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none' size={20} />
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && state === 'Sign Up' && (
                            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className='space-y-5 text-center'>
                                <div className='space-y-4 text-left'>
                                    <div className='relative group'>
                                        <MapPin className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors' size={20} />
                                        <input 
                                            className='w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-primary focus:shadow-xl focus:shadow-blue-500/5 transition-all outline-none' 
                                            placeholder='Address Line 1' type="text" onChange={(e) => setAddressLine1(e.target.value)} value={addressLine1} required 
                                        />
                                    </div>
                                    <div className='relative group'>
                                        <input 
                                            className='w-full px-6 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-primary focus:shadow-xl focus:shadow-blue-500/5 transition-all outline-none' 
                                            placeholder='Address Line 2 (Optional)' type="text" onChange={(e) => setAddressLine2(e.target.value)} value={addressLine2} 
                                        />
                                    </div>
                                </div>
                                <div className='p-6 bg-emerald-50 rounded-[32px] border border-emerald-100/50 flex flex-col items-center space-y-2'>
                                    <CheckCircle2 className='text-emerald-500' size={32} />
                                    <p className='text-[10px] font-black text-emerald-600 uppercase tracking-widest'>All Ready!</p>
                                    <p className='text-[11px] text-emerald-400 font-bold'>Verify your details and click finish below.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className='flex gap-4 pt-10'>
                        {state === 'Sign Up' && step > 1 && (
                            <button 
                                type='button' onClick={prevStep}
                                className='flex-1 py-5 rounded-3xl border border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all'
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                        )}
                        
                        {state === 'Sign Up' && step < 3 ? (
                            <button 
                                type='button' onClick={nextStep}
                                className='flex-1 py-5 rounded-3xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all'
                            >
                                Continue <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button 
                                type='submit' 
                                className='flex-1 py-5 rounded-3xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all'
                            >
                                {state === 'Sign Up' ? 'Finish Signup' : 'Login Now'}
                            </button>
                        )}
                    </div>
                </form>

                {/* Footer Toggles */}
                <div className='mt-12 pt-10 border-t border-slate-100 text-center space-y-6'>
                    {loginMode === 'Patient' && (
                        <p className='text-slate-400 font-medium text-sm'>
                            {state === 'Sign Up' ? "Already using CarePoint?" : "New to CarePoint?"}
                            <span 
                                onClick={() => { setState(state === 'Sign Up' ? 'Login' : 'Sign Up'); setStep(1); }} 
                                className='text-primary ml-2 font-black cursor-pointer hover:underline underline-offset-8 transition-all'
                            >
                                {state === 'Sign Up' ? 'Sign In' : 'Join Now'}
                            </span>
                        </p>
                    )}
                    
                    <div className='flex items-center justify-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]'>
                        <div className='w-4 h-px bg-slate-100' />
                        CarePoint Enterprise
                        <div className='w-4 h-px bg-slate-100' />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
