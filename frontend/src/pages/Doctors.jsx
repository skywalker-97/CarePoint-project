import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Search, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import DoctorCard from '../components/DoctorCard';

const Doctors = () => {
    const { speciality } = useParams();
    const [filterDoc, setFilterDoc] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'priceLow' | 'priceHigh' | 'experience'
    const [availableOnly, setAvailableOnly] = useState(false);

    const applyFilter = () => {
        let filtered = [...(doctors || [])];

        // 1. Speciality Filter
        if (speciality && filtered.length > 0) {
            filtered = filtered.filter(doc => doc.speciality === speciality);
        }

        // 2. Search Query
        if (searchQuery && filtered.length > 0) {
            filtered = filtered.filter(doc => (doc.name || "").toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // 3. Availability
        if (availableOnly && filtered.length > 0) {
            filtered = filtered.filter(doc => doc.available);
        }

        // 4. Sorting
        if (sortBy === 'priceLow' && filtered.length > 0) {
            filtered.sort((a, b) => (a.fees || 0) - (b.fees || 0));
        } else if (sortBy === 'priceHigh' && filtered.length > 0) {
            filtered.sort((a, b) => (b.fees || 0) - (a.fees || 0));
        } else if (sortBy === 'experience' && filtered.length > 0) {
            filtered.sort((a, b) => parseInt(b.experience || 0) - parseInt(a.experience || 0));
        }

        setFilterDoc(filtered);
    };

    const specialities = [
        'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'
    ];

    useEffect(() => {
        applyFilter();
    }, [doctors, speciality, searchQuery, sortBy, availableOnly]);

    return (
        <div className='pb-20 pt-12 max-w-7xl mx-auto px-6'>
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-4xl font-[900] text-slate-900 tracking-tight'>Find Your Specialist</h1>
                    <p className='text-sm text-slate-500 font-medium'>Browse through our network of world-class medical professionals.</p>
                </div>
                
                <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
                    {/* Search Bar */}
                    <div className='relative w-full sm:w-80 group'>
                        <Search className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors' size={18} />
                        <input 
                            type="text" 
                            placeholder="Search doctor name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-3xl outline-none focus:border-primary/30 focus:shadow-premium transition-all font-medium text-sm text-slate-700'
                        />
                    </div>
                    
                    {/* Sort Dropdown */}
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className='w-full sm:w-auto px-6 py-4 bg-white border border-slate-100 rounded-3xl outline-none cursor-pointer font-black text-[10px] uppercase tracking-widest text-slate-600 focus:border-primary/30 transition-all'
                    >
                        <option value="popular">Popularity</option>
                        <option value="priceLow">Fee: Low to High</option>
                        <option value="priceHigh">Fee: High to Low</option>
                        <option value="experience">Experience</option>
                    </select>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row items-start gap-10'>
                
                {/* ---------- Filter Sidebar ----------- */}
                <div className={`lg:w-72 w-full flex-shrink-0 space-y-6`}>
                    <div className='flex items-center justify-between lg:mb-4'>
                        <h3 className='text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]'>Filter by Speciality</h3>
                        <button onClick={() => setShowFilter(!showFilter)} className='lg:hidden p-2 bg-slate-50 rounded-xl'><Search size={18} /></button>
                    </div>
                    
                    <div className={`flex flex-col gap-2 transition-all duration-500 ${showFilter ? 'max-h-[500px] opacity-100' : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100 overflow-hidden'}`}>
                        <button 
                            onClick={() => navigate('/doctors')}
                            className={`w-full text-left px-6 py-4 rounded-2xl text-[13px] font-bold transition-all border flex items-center justify-between group ${!speciality ? 'bg-primary text-white border-primary shadow-xl shadow-blue-500/20' : 'bg-white text-slate-600 border-slate-100 hover:border-primary/20 hover:bg-slate-50'}`}
                        >
                            All Specialities
                            <ChevronRight size={16} className={`transition-transform ${!speciality ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                        </button>
                        
                        {specialities.map((item, index) => (
                            <button 
                                key={index}
                                onClick={() => navigate(speciality === item ? '/doctors' : `/doctors/${item}`)}
                                className={`w-full text-left px-6 py-4 rounded-2xl text-[13px] font-bold transition-all border flex items-center justify-between group ${speciality === item ? 'bg-primary text-white border-primary shadow-xl shadow-blue-500/20' : 'bg-white text-slate-600 border-slate-100 hover:border-primary/20 hover:bg-slate-50'}`}
                            >
                                {item}
                                <ChevronRight size={16} className={`transition-transform ${speciality === item ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                            </button>
                        ))}
                    </div>

                    <div className='p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex items-center justify-between'>
                        <div className='space-y-0.5'>
                            <p className='text-[10px] font-black text-emerald-600 uppercase tracking-widest'>Availability</p>
                            <p className='text-xs font-bold text-slate-600'>Available Now</p>
                        </div>
                        <button 
                            onClick={() => setAvailableOnly(!availableOnly)}
                            className={`w-12 h-6 rounded-full transition-all relative ${availableOnly ? 'bg-emerald-500' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${availableOnly ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className='hidden lg:block p-8 bg-slate-900 rounded-[32px] text-white overflow-hidden relative group'>
                        <div className='absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700' />
                        <h4 className='relative z-10 text-xl font-black mb-2'>Need Help?</h4>
                        <p className='relative z-10 text-[11px] text-slate-400 font-medium mb-6 leading-relaxed'>Get a free AI-powered health analysis using our symptom checker.</p>
                        <button onClick={() => navigate('/')} className='relative z-10 w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-[11px] font-black uppercase tracking-widest transition-all'>Check Symptoms</button>
                    </div>
                </div>

                {/* ---------- Doctors Grid ----------- */}
                <div className='flex-1'>
                    {filterDoc.length > 0 ? (
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.05
                                    }
                                }
                            }}
                            className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
                        >
                            {filterDoc.map((item, index) => (
                                <DoctorCard key={item._id || index} doc={item} />
                            ))}
                        </motion.div>
                    ) : (
                        <div className='py-32 flex flex-col items-center justify-center text-center space-y-6'>
                            <div className='w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200'>
                                <Search size={48} />
                            </div>
                            <div className='space-y-2'>
                                <h3 className='text-2xl font-black text-slate-900'>No Doctors Found</h3>
                                <p className='text-slate-400 font-medium max-w-xs'>We couldn't find any doctors matching this speciality right now.</p>
                            </div>
                            <button onClick={() => navigate('/doctors')} className='px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-blue-500/20'>Browse All</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
