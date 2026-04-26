import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import SymptomChecker from '../components/SymptomChecker';
import { 
    ChevronRight, Heart, Clock, ShieldCheck, Activity, ArrowRight, 
    UserPlus, Star, CheckCircle, Smartphone, Globe, Shield, 
    MessageCircle, HelpCircle, PhoneCall, Zap, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();
    const { doctors, token } = useContext(AppContext);
    const [activeFaq, setActiveFaq] = useState(null);

    const specialities = [
        { name: 'General physician', image: assets.General_physician, desc: 'Primary care and routine checkups' },
        { name: 'Gynecologist', image: assets.Gynecologist, desc: 'Women health and maternity care' },
        { name: 'Dermatologist', image: assets.Dermatologist, desc: 'Skin, hair, and nail specialists' },
        { name: 'Pediatricians', image: assets.Pediatricians, desc: 'Specialized care for children' },
        { name: 'Neurologist', image: assets.Neurologist, desc: 'Brain and nervous system expert' },
        { name: 'Gastroenterologist', image: assets.Gastroenterologist, desc: 'Digestive system specialists' },
    ];

    const faqs = [
        { 
            q: "How do I book an appointment?", 
            a: "Simply search for your required specialist, select a convenient time slot, and confirm your booking. You'll receive instant confirmation via email." 
        },
        { 
            q: "Is online consultation available?", 
            a: "Yes! Many of our doctors offer real-time chat and video consultations. Look for the 'Online' badge on doctor profiles." 
        },
        { 
            q: "Is my medical history secure?", 
            a: "Absolutely. We use HIPAA-compliant encryption to ensure your health data is stored securely and only accessible to you and your authorized doctors." 
        }
    ];

    const stats = [
        { label: "Verified Doctors", value: "500+" },
        { label: "Specializations", value: "20+" },
        { label: "Happy Patients", value: "10K+" }
    ];

    return (
        <div className='bg-[#F8FAFC] font-inter overflow-x-hidden'>
            {/* Section 1: Premium Hero Section */}
            <section className='relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-between gap-16 px-6 sm:px-12 lg:px-24 pt-32 pb-20'>
                {/* Background Blobs */}
                <div className='absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none'>
                    <div className='absolute -top-24 -right-24 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]' />
                    <div className='absolute top-1/2 -left-24 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]' />
                </div>

                <div className='flex-1 space-y-12 relative z-10 text-center lg:text-left'>
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full border border-slate-100 shadow-sm'
                    >
                        <Zap size={14} className='text-primary fill-primary' />
                        <span className='text-[10px] font-black uppercase tracking-[0.3em] text-slate-500'>Smarter Healthcare is here</span>
                    </motion.div>

                    <div className='space-y-6'>
                        <h1 className='text-5xl md:text-7xl lg:text-8xl font-[900] text-slate-900 leading-[1.05] tracking-tight'>
                            Your Health, <br />
                            <span className='text-primary'>Smarter. Faster. Better.</span>
                        </h1>
                        <p className='text-lg md:text-xl text-[#64748B] font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0'>
                            Book appointments, consult trusted doctors, track medical history, and get AI-powered symptom guidance—all in one platform.
                        </p>
                    </div>

                    <div className='flex flex-wrap items-center justify-center lg:justify-start gap-6'>
                        <button 
                            onClick={() => navigate('/doctors')}
                            className='px-10 py-5 bg-[#2563EB] text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all'
                        >
                            Book Appointment
                        </button>
                        <button 
                            onClick={() => window.scrollTo({ top: 2200, behavior: 'smooth' })}
                            className='px-10 py-5 bg-white text-slate-900 rounded-3xl font-black text-sm uppercase tracking-widest border border-slate-100 shadow-sm hover:bg-slate-50 active:scale-95 transition-all'
                        >
                            AI Symptom Checker
                        </button>
                    </div>

                    <div className='grid grid-cols-3 gap-8 pt-10 border-t border-slate-100 w-full lg:w-fit'>
                        {stats.map((stat, i) => (
                            <div key={i} className='space-y-1'>
                                <p className='text-3xl font-black text-slate-900 tracking-tight'>{stat.value}</p>
                                <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex-1 relative w-full lg:w-auto flex items-center justify-center'>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='relative w-full max-w-2xl'
                    >
                        <div className='absolute -inset-10 bg-primary/10 rounded-full blur-[100px] animate-pulse' />
                        <img 
                            src={assets.dashboard_preview} 
                            alt="Dashboard Preview" 
                            className='relative z-10 w-full h-auto rounded-[40px] shadow-premium border-8 border-white/50 backdrop-blur-sm'
                        />
                        
                        {/* Floating Trust Indicator */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className='absolute -top-10 -right-4 z-20 bg-white p-5 rounded-3xl shadow-elevated border border-slate-50 flex items-center gap-4'
                        >
                            <div className='w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500'>
                                <CheckCircle size={24} fill="currentColor" />
                            </div>
                            <div>
                                <p className='text-sm font-black text-slate-900'>HIPAA Secure</p>
                                <p className='text-[10px] text-slate-400 font-bold uppercase'>Encrypted Data</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Trusted By / Social Proof */}
            <section className='bg-white py-20 border-y border-slate-50'>
                <div className='container mx-auto px-6 space-y-12'>
                    <p className='text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]'>Trusted by Leading Institutions</p>
                    <div className='flex flex-wrap items-center justify-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700'>
                        <img src={assets.hospital_logos} alt="Hospital Logos" className='h-12 w-auto object-contain' />
                    </div>
                    <div className='flex items-center justify-center gap-12 pt-8'>
                        <div className='flex items-center gap-2'>
                            <Award className='text-primary' size={20} />
                            <span className='text-xs font-black text-slate-900 uppercase tracking-widest'>NABH Certified</span>
                        </div>
                        <div className='h-4 w-px bg-slate-200' />
                        <div className='flex items-center gap-2'>
                            <Star className='text-yellow-400 fill-yellow-400' size={20} />
                            <span className='text-xs font-black text-slate-900 uppercase tracking-widest'>4.9/5 Patient Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Services Section */}
            <section className='py-32 container mx-auto px-6 space-y-20'>
                <div className='text-center space-y-4'>
                    <h2 className='text-4xl md:text-5xl font-[900] text-slate-900 tracking-tight'>End-to-End Care</h2>
                    <p className='text-slate-500 font-medium max-w-xl mx-auto'>Experience a comprehensive suite of healthcare tools designed for the modern patient.</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {[
                        { title: 'Book Appointment', desc: 'Find and schedule visits with top-rated specialists in seconds.', icon: UserPlus, color: 'text-blue-500 bg-blue-50' },
                        { title: 'Online Consultation', desc: 'Secure video and chat consultations from the comfort of home.', icon: Globe, color: 'text-indigo-500 bg-indigo-50' },
                        { title: 'AI Symptom Checker', desc: 'Instant guidance based on your symptoms using advanced AI.', icon: Activity, color: 'text-emerald-500 bg-emerald-50' },
                        { title: 'Medical History', desc: 'Your health records, prescriptions, and history in one secure place.', icon: Shield, color: 'text-rose-500 bg-rose-50' },
                        { title: 'Lab Tests', desc: 'Book diagnostic tests and receive results directly in the app.', icon: Zap, color: 'text-amber-500 bg-amber-50' },
                        { title: 'Prescriptions', desc: 'Digital, downloadable prescriptions available immediately after visit.', icon: Smartphone, color: 'text-violet-500 bg-violet-50' },
                    ].map((service, i) => (
                        <div key={i} className='group p-10 bg-white rounded-[48px] border border-slate-100 transition-all duration-500 hover:border-primary/20 hover:shadow-premium hover:-translate-y-2'>
                            <div className={`w-16 h-16 ${service.color} rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500 shadow-inner`}>
                                <service.icon size={28} />
                            </div>
                            <h3 className='text-2xl font-black text-slate-900 mb-4 tracking-tight'>{service.title}</h3>
                            <p className='text-slate-500 font-medium leading-relaxed'>{service.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 4 & 5: AI & Specialists (Refined via Components) */}
            <div className='bg-slate-50/50 py-32 space-y-32'>
                {/* AI Section Highlight */}
                <div id="ai-section" className='container mx-auto px-6'>
                    <div className='flex flex-col lg:flex-row items-center gap-20'>
                        <div className='flex-1 space-y-10'>
                            <div className='inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full'>
                                <Activity size={14} className='text-primary' />
                                <span className='text-[10px] font-black uppercase tracking-widest text-primary'>Startup-Level Innovation</span>
                            </div>
                            <h2 className='text-4xl md:text-6xl font-[900] text-slate-900 leading-tight tracking-tight'>
                                The Future of <br />
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500'>Symptom Analysis.</span>
                            </h2>
                            <p className='text-slate-500 text-lg font-medium leading-relaxed'>
                                Describe your symptoms and our AI helps suggest the right specialist. No more guessing—just precise, instant guidance for your health journey.
                            </p>
                            <ul className='space-y-4'>
                                {['Instant Specialist Recommendations', '24/7 AI Availability', 'Data-Driven Health Insights'].map((item, i) => (
                                    <li key={i} className='flex items-center gap-3 text-slate-900 font-black text-sm uppercase tracking-widest'>
                                        <div className='w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center'>
                                            <CheckCircle size={14} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='flex-1 w-full'>
                            <SymptomChecker />
                        </div>
                    </div>
                </div>

                {/* Specialists Section */}
                <section className='container mx-auto px-6 space-y-20'>
                    <div className='flex flex-col md:flex-row items-end justify-between gap-8'>
                        <div className='space-y-3'>
                            <p className='text-[10px] font-black text-primary uppercase tracking-[0.4em]'>Specialists</p>
                            <h2 className='text-4xl md:text-5xl font-[900] text-slate-900 tracking-tight'>Find by Category</h2>
                        </div>
                        <button onClick={() => navigate('/doctors')} className='text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-all group'>
                            View All <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
                        </button>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
                        {specialities.map((item, index) => (
                            <Link 
                                key={index} 
                                onClick={() => window.scrollTo(0, 0)} 
                                className='group flex flex-col items-center p-10 bg-white rounded-[48px] border border-slate-100 transition-all duration-500 hover:border-primary/20 hover:shadow-premium hover:-translate-y-2' 
                                to={`/doctors/${item.name}`}
                            >
                                <div className='w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-blue-50 group-hover:scale-110 shadow-inner'>
                                    <img className='w-10 group-hover:rotate-12 transition-transform duration-500' src={item.image} alt={item.name} />
                                </div>
                                <p className='text-xs font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors text-center'>{item.name}</p>
                                <p className='text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity'>Consult Now</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            {/* Section 6: Featured Doctors */}
            <section className='py-32 container mx-auto px-6 space-y-20'>
                <div className='flex flex-col items-center text-center space-y-4'>
                    <p className='text-[10px] font-black text-primary uppercase tracking-[0.4em]'>Featured Professionals</p>
                    <h2 className='text-4xl md:text-5xl font-[900] text-slate-900 tracking-tight'>Top Rated Doctors</h2>
                    <div className='w-16 h-1.5 bg-primary rounded-full' />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {doctors.slice(0, 4).map((item, index) => (
                        <div 
                            key={index}
                            onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }}
                            className='group bg-white rounded-[48px] border border-slate-100 overflow-hidden cursor-pointer hover:shadow-elevated transition-all duration-500 hover:-translate-y-2'
                        >
                            <div className='relative h-72 overflow-hidden bg-slate-50'>
                                <img className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' src={item.image || item.fallbackImage} alt={item.name} />
                                <div className='absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl flex items-center gap-2 shadow-sm border border-white/50'>
                                    <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${item.available ? 'text-emerald-600' : 'text-slate-500'}`}>
                                        {item.available ? 'Next Slot: Today' : 'Busy'}
                                    </span>
                                </div>
                                {index === 0 && (
                                    <div className='absolute bottom-6 left-6 px-4 py-2 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest'>
                                        Most Booked This Week
                                    </div>
                                )}
                            </div>
                            <div className='p-10 space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <p className='text-[10px] font-black text-primary uppercase tracking-[0.2em]'>{item.speciality}</p>
                                    <div className='flex items-center gap-1 text-amber-400'>
                                        <Star size={12} fill="currentColor" />
                                        <span className='text-xs font-black text-slate-900'>4.9</span>
                                    </div>
                                </div>
                                <h3 className='text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors'>
                                    {item.name.startsWith('Dr.') ? item.name : `Dr. ${item.name}`}
                                </h3>
                                <div className='flex items-center gap-4 text-slate-400'>
                                    <div className='flex items-center gap-1'>
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        <p className='text-xs font-bold'>{item.experience} Exp.</p>
                                    </div>
                                    <div className='w-1.5 h-1.5 rounded-full bg-slate-100' />
                                    <p className='text-xs font-bold text-slate-900'>$50 / Visit</p>
                                </div>
                                <button className='w-full py-4 bg-slate-50 text-slate-600 group-hover:bg-primary group-hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all'>
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 7: How It Works */}
            <section className='bg-slate-900 py-32 rounded-[60px] mx-6 mb-32 overflow-hidden relative'>
                <div className='absolute inset-0 opacity-10 pointer-events-none' style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className='container mx-auto px-6 space-y-24 relative z-10'>
                    <div className='text-center space-y-6'>
                        <h2 className='text-4xl md:text-6xl font-[900] text-white tracking-tight'>Care Delivery, Simplified.</h2>
                        <p className='text-slate-400 font-medium max-w-xl mx-auto'>Three simple steps to connect with world-class healthcare professionals.</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-16'>
                        {[
                            { step: '01', title: 'Search Doctor', desc: 'Browse through hundreds of verified specialists and read patient reviews.' },
                            { step: '02', title: 'Book Appointment', desc: 'Select a flexible time slot and confirm your visit instantly.' },
                            { step: '03', title: 'Get Treated', desc: 'Consult with your doctor via chat or in-person and receive care.' },
                        ].map((item, i) => (
                            <div key={i} className='relative group'>
                                <div className='text-8xl font-black text-white/5 absolute -top-12 -left-6 group-hover:text-primary/10 transition-colors'>{item.step}</div>
                                <div className='space-y-6'>
                                    <h3 className='text-2xl font-black text-white tracking-tight'>{item.title}</h3>
                                    <p className='text-slate-400 font-medium leading-relaxed'>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 8: Testimonials */}
            <section className='container mx-auto px-6 space-y-20 pb-32'>
                <div className='text-center space-y-4'>
                    <p className='text-[10px] font-black text-primary uppercase tracking-[0.4em]'>Success Stories</p>
                    <h2 className='text-4xl md:text-5xl font-[900] text-slate-900 tracking-tight'>What Patients Say</h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {[
                        { name: 'Sarah Jenkins', role: 'Patient', review: 'The AI symptom checker was incredibly accurate. It saved me hours of worrying and pointed me to the right specialist immediately.', rating: 5 },
                        { name: 'Michael Chen', role: 'Patient', review: 'Hands down the most premium healthcare app I’ve used. Booking is seamless and the chat feature is a game changer.', rating: 5 },
                        { name: 'Elena Rodriguez', role: 'Patient', review: 'I love how secure and organized my medical records are. It makes my follow-up visits so much easier for me and my doctor.', rating: 5 },
                    ].map((review, i) => (
                        <div key={i} className='p-10 bg-white rounded-[40px] border border-slate-100 shadow-premium space-y-8'>
                            <div className='flex gap-1'>
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} className='text-amber-400 fill-amber-400' />)}
                            </div>
                            <p className='text-slate-700 font-medium leading-relaxed text-lg'>"{review.review}"</p>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black'>
                                    {review.name[0]}
                                </div>
                                <div>
                                    <p className='text-sm font-black text-slate-900'>{review.name}</p>
                                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 9: FAQ Section */}
            <section className='bg-white py-32'>
                <div className='container mx-auto px-6 max-w-4xl space-y-20'>
                    <div className='text-center space-y-4'>
                        <h2 className='text-4xl font-[900] text-slate-900 tracking-tight'>Common Questions</h2>
                        <p className='text-slate-400 font-medium'>Everything you need to know about the CarePoint platform.</p>
                    </div>

                    <div className='space-y-4'>
                        {faqs.map((faq, i) => (
                            <div key={i} className='rounded-[32px] border border-slate-100 overflow-hidden transition-all duration-300'>
                                <button 
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className='w-full p-8 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left'
                                >
                                    <span className='font-black text-slate-900 tracking-tight'>{faq.q}</span>
                                    <ChevronRight size={20} className={`text-primary transition-transform duration-300 ${activeFaq === i ? 'rotate-90' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeFaq === i && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className='overflow-hidden bg-slate-50/50'
                                        >
                                            <div className='p-8 pt-0 text-slate-500 font-medium leading-relaxed'>
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 10: Final CTA Section */}
            <section className='py-32 container mx-auto px-6'>
                <div className='bg-[#2563EB] rounded-[60px] p-12 md:p-24 text-center space-y-12 relative overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent pointer-events-none' />
                    <div className='relative z-10 space-y-6'>
                        <h2 className='text-5xl md:text-7xl font-[900] text-white tracking-tight leading-none'>Healthcare Made <br /> Beautifully Simple.</h2>
                        <p className='text-blue-100 text-lg md:text-xl font-medium max-w-xl mx-auto opacity-80'>Join 10,000+ patients who have upgraded their health experience with CarePoint.</p>
                    </div>
                    <div className='relative z-10 flex flex-wrap items-center justify-center gap-6'>
                        <button 
                            onClick={() => { navigate('/login'); window.scrollTo(0, 0); }}
                            className='px-12 py-6 bg-white text-primary rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-black/10 hover:scale-105 active:scale-95 transition-all'
                        >
                            Get Started Now
                        </button>
                        <button 
                            onClick={() => navigate('/contact')}
                            className='px-12 py-6 bg-blue-600 text-white rounded-[28px] font-black text-sm uppercase tracking-widest border border-blue-400/50 hover:bg-blue-700 active:scale-95 transition-all'
                        >
                            Talk to Support
                        </button>
                    </div>
                </div>
            </section>

            {/* Sticky Floating CTA */}
            <motion.div 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                className='fixed bottom-10 right-10 z-[1000]'
            >
                <button 
                    onClick={() => navigate('/doctors')}
                    className='group relative flex items-center gap-4 pl-8 pr-4 py-4 bg-slate-900 text-white rounded-full shadow-elevated hover:bg-primary transition-all active:scale-95'
                >
                    <div className='flex flex-col items-end'>
                        <p className='text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-100 transition-colors'>Need urgent care?</p>
                        <p className='text-xs font-black tracking-tight'>Talk to Doctor Now</p>
                    </div>
                    <div className='w-10 h-10 bg-primary group-hover:bg-white group-hover:text-primary rounded-full flex items-center justify-center transition-all shadow-lg'>
                        <PhoneCall size={18} />
                    </div>
                </button>
            </motion.div>
        </div>
    );
};

export default Home;
