import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, MapPin, Calendar, Camera, Edit2, Check, X, Shield, Globe, Award, Sparkles, Loader2, Activity, Zap } from 'lucide-react';
import { getUserImage } from '../utils/imageHelper';

const MyProfile = () => {
    const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState(userData || {
        name: "User Name",
        email: "user@example.com",
        phone: "0000000000",
        address: { line1: "", line2: "" },
        gender: "Not Selected",
        dob: "2000-01-01",
        medicalHistory: []
    });

    const [healthData, setHealthData] = useState(null);
    const [loadingHealth, setLoadingHealth] = useState(false);

    // Populate formData when userData changes
    React.useEffect(() => {
        if (userData) {
            setFormData(userData);
            fetchHealthScore();
        }
    }, [userData]);

    const fetchHealthScore = async () => {
        // Create a unique hash of the user's current medical state
        const cacheKey = `health_score_${userData._id}`;
        const currentProfileHash = JSON.stringify({ age: userData.dob, gender: userData.gender, history: userData.medicalHistory });
        
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            if (parsed.profileHash === currentProfileHash) {
                setHealthData(parsed.healthData);
                return; // Return early, don't recalculate!
            }
        }

        setLoadingHealth(true);
        try {
            const { data } = await axios.post(backendUrl + '/api/ai/health-score', { 
                userData, 
                history: userData.medicalHistory 
            }, { headers: { token } });
            
            if (data.success) {
                setHealthData(data.healthData);
                // Save to cache
                localStorage.setItem(cacheKey, JSON.stringify({
                    profileHash: currentProfileHash,
                    healthData: data.healthData
                }));
            }
        } catch (e) {
            console.log("Health Score Error:", e);
        } finally {
            setLoadingHealth(false);
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
                setIsEdit(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateUserProfileData = async () => {
        try {
            const updateData = {
                userId: formData._id,
                name: formData.name,
                phone: formData.phone,
                address: JSON.stringify(formData.address),
                gender: formData.gender,
                dob: formData.dob,
                medicalHistory: formData.medicalHistory
            };
            
            if (formData.image) {
                updateData.image = formData.image;
            }

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', updateData, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    if (!userData) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center justify-center space-y-4'>
                <div className='w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin' />
                <p className='text-slate-400 font-black text-[10px] uppercase tracking-widest'>Accessing Secure Data...</p>
            </div>
        );
    }

    const ProfileIcon = ({ icon: Icon, color = "primary" }) => (
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 ${color === 'primary' ? 'bg-blue-50/50 text-primary' : 'bg-slate-50/50 text-slate-400'}`}>
            <Icon size={18} />
        </div>
    );

    return (
        <div className='max-w-6xl mx-auto px-6 py-12 space-y-12'>
            {/* Header / Cover Section */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='relative'
            >
                <div className='h-64 rounded-[48px] bg-gradient-to-br from-slate-900 to-slate-800 shadow-premium overflow-hidden relative'>
                    <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    <div className='absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]' />
                </div>

                <div className='px-4 sm:px-12 -mt-20 relative z-10 flex flex-col md:flex-row md:items-end gap-6 sm:gap-8'>
                    <div className='relative group shrink-0 self-start md:self-auto'>
                        <div className='w-32 h-32 md:w-40 md:h-40 rounded-[32px] md:rounded-[40px] bg-white p-2 shadow-premium'>
                            <div className='w-full h-full rounded-[24px] md:rounded-[32px] bg-slate-100 flex items-center justify-center text-4xl md:text-5xl font-black text-slate-300 overflow-hidden border-4 border-white'>
                                {formData.image ? <img src={getUserImage(formData)} alt="" className="w-full h-full object-cover" /> : (formData.name || "U").charAt(0)}
                            </div>
                        </div>
                        <input type="file" id="image" hidden accept="image/*" onChange={handleImageUpload} />
                        <label htmlFor="image" className='absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all border-4 border-white cursor-pointer'>
                            <Camera size={18} />
                        </label>
                    </div>

                    <div className='flex-1 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-6'>
                        <div className='space-y-1'>
                            <p className='text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1'>Patient ID: #{userData?._id?.slice(-6).toUpperCase() || 'NEW'}</p>
                            <h1 className='text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none'>
                                {isEdit 
                                    ? <input className='bg-white/40 backdrop-blur-md border border-slate-200 px-4 py-1 rounded-2xl outline-none focus:border-primary transition-all w-full md:w-96' type="text" onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} value={formData.name} />
                                    : formData.name
                                }
                            </h1>
                            <div className='flex items-center gap-2 text-slate-500 font-bold text-sm pt-1'>
                                <Globe size={14} /> Global Citizen · Member since 2024
                            </div>
                        </div>

                        <div className='flex flex-wrap gap-4'>
                            {isEdit ? (
                                <>
                                    <button onClick={() => setIsEdit(false)} className='px-6 md:px-8 py-4 bg-white border border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm flex items-center gap-3'>
                                        <X size={16} /> Cancel
                                    </button>
                                    <button onClick={updateUserProfileData} className='px-6 md:px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-2xl shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all flex items-center gap-3'>
                                        <Check size={16} /> Save Changes
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEdit(true)} className='px-8 md:px-10 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-2xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3'>
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Information Grid */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className='lg:col-span-2 space-y-8'
                >
                    <div className='bg-white/60 backdrop-blur-xl rounded-[48px] border border-slate-100 p-10 shadow-premium space-y-10'>
                        <div className='flex items-center gap-4'>
                            <div className='w-1.5 h-10 bg-primary rounded-full' />
                            <h2 className='text-2xl font-black text-slate-900 tracking-tight'>Personal Details</h2>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                            <div className='space-y-4'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Full Name</label>
                                <div className='flex items-center gap-4 p-4 bg-slate-50/50 rounded-3xl border border-slate-100 group transition-all'>
                                    <ProfileIcon icon={User} />
                                    <p className='font-black text-slate-700'>{formData.name}</p>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Email Address</label>
                                <div className='flex items-center gap-4 p-4 bg-slate-50/50 rounded-3xl border border-slate-100'>
                                    <ProfileIcon icon={Mail} />
                                    <p className='font-black text-slate-700'>{formData.email}</p>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Mobile Phone</label>
                                <div className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${isEdit ? 'bg-white border-primary shadow-xl shadow-blue-500/5' : 'bg-slate-50/50 border-slate-100'}`}>
                                    <ProfileIcon icon={Phone} />
                                    {isEdit 
                                        ? <input className='bg-transparent font-black text-slate-700 outline-none w-full' type="text" onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} value={formData.phone} />
                                        : <p className='font-black text-slate-700'>{formData.phone}</p>
                                    }
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Date of Birth</label>
                                <div className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${isEdit ? 'bg-white border-primary shadow-xl shadow-blue-500/5' : 'bg-slate-50/50 border-slate-100'}`}>
                                    <ProfileIcon icon={Calendar} />
                                    {isEdit 
                                        ? <input className='bg-transparent font-black text-slate-700 outline-none w-full' type="date" onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))} value={formData.dob} />
                                        : <p className='font-black text-slate-700'>{formData.dob}</p>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Residential Address</label>
                            <div className={`flex items-start gap-4 p-6 rounded-[36px] border transition-all ${isEdit ? 'bg-white border-primary shadow-xl shadow-blue-500/5' : 'bg-slate-50/50 border-slate-100'}`}>
                                <ProfileIcon icon={MapPin} />
                                <div className='flex-1 space-y-2'>
                                    {isEdit ? (
                                        <>
                                            <input className='bg-white/60 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-primary w-full' type="text" onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={formData.address.line1} placeholder="Line 1" />
                                            <input className='bg-white/60 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-primary w-full' type="text" onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={formData.address.line2} placeholder="Line 2" />
                                        </>
                                    ) : (
                                        <p className='font-black text-slate-700 leading-relaxed'>{formData.address?.line1 || 'N/A'}, {formData.address?.line2 || ''}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Medical History Section */}
                        <div className='space-y-6 pt-4'>
                            <div className='flex items-center justify-between'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Medical History & Records</label>
                                {isEdit && (
                                    <div className='flex gap-2'>
                                        <input 
                                            id="new-history"
                                            className='bg-white/60 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:border-primary' 
                                            type="text" 
                                            placeholder="Add record..." 
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (e.target.value.trim()) {
                                                        setFormData(prev => ({ ...prev, medicalHistory: [...prev.medicalHistory, e.target.value.trim()] }));
                                                        e.target.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-wrap gap-3'>
                                {Array.isArray(formData.medicalHistory) && formData.medicalHistory.length > 0 ? (
                                    formData.medicalHistory.map((item, index) => (
                                        <div key={index} className='group flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all'>
                                            <Activity size={14} className="text-primary" />
                                            <span className='text-xs font-black text-slate-700'>{item}</span>
                                            {isEdit && (
                                                <button 
                                                    onClick={() => setFormData(prev => ({ ...prev, medicalHistory: (prev.medicalHistory || []).filter((_, i) => i !== index) }))}
                                                    className='text-slate-300 hover:text-red-500 transition-colors'
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className='w-full p-8 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center'>
                                        <Shield size={32} className='text-slate-200 mb-3' />
                                        <p className='text-xs font-bold text-slate-400'>No medical records found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar Cards */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className='space-y-8'
                >
                    {/* AI Health Score Card */}
                    <div className='bg-slate-900 rounded-[48px] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden group'>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles size={80} className="text-primary" />
                        </div>

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                <Sparkles size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Vital Intelligence</h3>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Personalized AI Health Index</p>
                            </div>
                        </div>

                        {loadingHealth ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-4">
                                <Loader2 className="animate-spin text-primary" size={32} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Calculating score...</p>
                            </div>
                        ) : healthData && (
                            <div className="space-y-8 relative z-10 text-center">
                                <div className="relative inline-flex items-center justify-center">
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64" />
                                        <circle className="text-primary transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray={351.8} strokeDashoffset={351.8 - (351.8 * healthData.score) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64" />
                                    </svg>
                                    <div className="absolute flex flex-col">
                                        <span className="text-4xl font-black">{healthData.score}</span>
                                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Score</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        healthData.category === 'Excellent' ? 'bg-emerald-500/20 text-emerald-400' : 
                                        healthData.category === 'Good' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                                    }`}>
                                        {healthData.category} Health
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">
                                        {healthData.summary}
                                    </p>
                                </div>

                                <div className="space-y-3 text-left pt-4 border-t border-white/5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Recommendations</p>
                                    {(healthData.recommendations || []).map((tip, idx) => (
                                        <div key={idx} className="flex gap-3 items-start">
                                            <Zap size={12} className="text-primary mt-0.5 shrink-0" />
                                            <p className="text-[10px] text-slate-300 font-bold leading-tight">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='bg-white/60 backdrop-blur-xl rounded-[40px] border border-slate-100 p-8 shadow-premium space-y-6'>
                        <div className='flex items-center gap-3'>
                            <Shield className='text-emerald-500' />
                            <h3 className='font-black text-slate-900 tracking-tight'>Security Status</h3>
                        </div>
                        <div className='p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex flex-col items-center text-center space-y-2'>
                            <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-500'>
                                <Award />
                            </div>
                            <p className='text-[10px] font-black text-emerald-600 uppercase tracking-widest'>Profile Verified</p>
                            <p className='text-xs text-emerald-400 font-bold'>Your account is secured with 2FA.</p>
                        </div>
                    </div>

                    <div className='bg-primary/5 rounded-[40px] border border-primary/10 p-8 space-y-6'>
                        <h3 className='font-black text-slate-900 tracking-tight'>Quick Actions</h3>
                        <div className='grid grid-cols-1 gap-3'>
                            <button className='w-full py-4 bg-white border border-slate-100 rounded-2xl font-black text-xs text-slate-600 uppercase tracking-widest hover:border-primary transition-all active:scale-95 shadow-sm'>
                                Download EHR
                            </button>
                            <button className='w-full py-4 bg-white border border-slate-100 rounded-2xl font-black text-xs text-slate-600 uppercase tracking-widest hover:border-primary transition-all active:scale-95 shadow-sm'>
                                Manage Privacy
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MyProfile;
