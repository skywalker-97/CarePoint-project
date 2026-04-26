import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    Search, Activity, AlertTriangle, UserPlus, Info, 
    ChevronRight, Stethoscope, Sparkles, Zap, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SymptomChecker = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const checkSymptoms = async (e) => {
        e.preventDefault();
        if (!token) return toast.info("Please login to use AI features");
        if (!symptoms.trim()) return;

        setLoading(true);
        try {
            const { data } = await axios.post(
                backendUrl + '/api/ai/symptom-check',
                { symptoms },
                { headers: { token } }
            );

            if (data.success) {
                setResult(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to analyze symptoms");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full font-inter">
            <div className="bg-white rounded-[48px] p-8 md:p-12 border border-slate-100 shadow-premium relative overflow-hidden group">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles size={120} className="text-primary" />
                </div>

                <div className="relative z-10 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary">
                                <Zap size={16} fill="currentColor" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Engine v2.0</span>
                            </div>
                            <h3 className="text-3xl font-[900] text-slate-900 tracking-tight">Smart Symptom Analysis</h3>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Secure & Private</span>
                        </div>
                    </div>

                    <form onSubmit={checkSymptoms} className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="Describe how you feel (e.g., persistent headache and fatigue)..."
                                className="w-full pl-16 pr-6 py-6 bg-slate-50 rounded-[32px] border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-slate-700 font-medium transition-all"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-6 bg-primary text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 disabled:bg-slate-300 transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analyzing Symptoms...
                                </>
                            ) : (
                                <>
                                    <Activity size={18} />
                                    Analyze Symptoms Now
                                </>
                            )}
                        </button>
                    </form>

                    <AnimatePresence>
                        {result && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="pt-10 border-t border-slate-50 space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Possible Issues */}
                                    <div className="bg-slate-50/50 p-8 rounded-[40px] border border-slate-100 space-y-6">
                                        <div className="flex items-center gap-3 text-slate-900 font-black text-xs uppercase tracking-widest">
                                            <div className="w-8 h-8 bg-blue-100 text-primary rounded-xl flex items-center justify-center">
                                                <Info size={16} />
                                            </div>
                                            Potential Issues
                                        </div>
                                        <ul className="space-y-4">
                                            {result.possibleIssues.map((issue, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    {issue}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Recommendation */}
                                    <div className="bg-[#0F172A] p-10 rounded-[40px] space-y-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Recommended Specialist</p>
                                            <h4 className="text-3xl font-[900] tracking-tight">{result.recommendedSpecialist}</h4>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/doctors/${result.recommendedSpecialist}`)}
                                            className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-3 group"
                                        >
                                            Book Consultation <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                {/* Advice Alert */}
                                <div className={`p-8 rounded-[32px] border flex items-start gap-5 ${
                                    result.severity === 'High' ? 'bg-rose-50 border-rose-100 text-rose-900' :
                                    result.severity === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-900' :
                                    'bg-emerald-50 border-emerald-100 text-emerald-900'
                                }`}>
                                    <div className={`p-3 rounded-2xl ${
                                        result.severity === 'High' ? 'bg-rose-100' :
                                        result.severity === 'Medium' ? 'bg-amber-100' :
                                        'bg-emerald-100'
                                    }`}>
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                            Assessment: {result.severity} Priority
                                        </h4>
                                        <p className="text-sm font-medium leading-relaxed opacity-80">{result.advice}</p>
                                        <p className="pt-4 text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
                                            * Disclaimer: This AI simulation is for information only and not a clinical diagnosis.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SymptomChecker;
