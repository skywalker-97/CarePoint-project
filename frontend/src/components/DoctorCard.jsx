import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, ChevronRight, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';

const DoctorCard = ({ doc }) => {
    const navigate = useNavigate();
    const { onlineDoctors } = useContext(AppContext);
    const isOnline = onlineDoctors?.has(doc._id);

    return (
        <motion.div 
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -10 }}
            onClick={() => { navigate(`/appointment/${doc._id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="group relative bg-white rounded-[40px] border border-slate-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 flex flex-col"
        >
            {/* Image Container with Glass Overlay */}
            <div className="relative h-72 overflow-hidden bg-slate-50">
                {doc.image || doc.fallbackImage ? (
                    <img 
                        src={doc.image || doc.fallbackImage} 
                        alt={doc.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => {
                            if (doc.fallbackImage && e.currentTarget.src !== doc.fallbackImage) {
                                e.currentTarget.src = doc.fallbackImage;
                            } else {
                                e.currentTarget.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                            }
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/10 font-black text-8xl uppercase tracking-tighter">
                        {(doc.name || 'D').charAt(0)}
                    </div>
                )}
                
                {/* Availability Badge */}
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                    <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-2 shadow-sm border border-white/50">
                        <div className={`w-2 h-2 rounded-full ${doc.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">
                            {doc.available ? 'Available' : 'Busy'}
                        </span>
                    </div>
                    {isOnline && (
                        <div className="px-3 py-1 bg-blue-500/90 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white">Online</span>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); }} 
                    className="absolute top-5 right-5 w-10 h-10 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white hover:shadow-lg transition-all active:scale-90"
                >
                    <Bookmark size={18} />
                </button>

                {/* Glassy Tag */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/20 backdrop-blur-xl rounded-[24px] border border-white/30 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <Star key={i} size={8} className="text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Top Rated</span>
                    </div>
                    <span className="text-[10px] font-black text-white tracking-tight px-3 py-1 bg-primary rounded-full shadow-lg shadow-blue-500/20">
                        {doc.fees}$ / hr
                    </span>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-8 space-y-5 flex-1 flex flex-col">
                <div className='space-y-1'>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{doc.speciality}</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {(doc.name || 'Unknown').startsWith('Dr.') ? doc.name : `Dr. ${doc.name || 'Unknown'}`}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 pt-1 flex items-center gap-2 truncate">
                        {doc.email}
                    </p>
                </div>

                <div className="flex items-center gap-5 text-[11px] text-slate-500 font-bold border-b border-slate-50 pb-5">
                    <div className="flex items-center gap-2">
                        <div className='w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-primary shadow-inner'>
                            <Clock size={12} />
                        </div>
                        <span>{doc.experience || 'N/A'} Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className='w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500 shadow-inner'>
                            <Star size={12} fill="currentColor" />
                        </div>
                        <span>4.9 (1.2k)</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={14} className="text-slate-300" />
                        <span className="text-[11px] font-bold line-clamp-1">Downtown Medical Square</span>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:shadow-xl group-hover:shadow-teal-500/20 transition-all">
                        <ChevronRight size={18} className='group-hover:translate-x-0.5 transition-transform' />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DoctorCard;
