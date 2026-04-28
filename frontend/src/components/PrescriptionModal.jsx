import React, { useState, useContext } from 'react';
import { X, Plus, Trash2, FileText, Pill, Calendar, Activity, Sparkles, Loader2, ShieldCheck, ListChecks, AlertCircle, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PrescriptionModal = ({ appointment, onClose, onSave }) => {
    const { dToken } = useContext(DoctorContext);
    const { backendUrl } = useContext(AppContext);

    const [diagnosis, setDiagnosis] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [labTests, setLabTests] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [note, setNote] = useState('');
    const [rawNotes, setRawNotes] = useState('');
    const [followUpPlan, setFollowUpPlan] = useState('');
    const [consultationSummary, setConsultationSummary] = useState('');
    const [careInstructions, setCareInstructions] = useState([]);
    const [redFlags, setRedFlags] = useState([]);
    const [recommendedTests, setRecommendedTests] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [items, setItems] = useState([
        { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);

    const handleAIGenerate = async () => {
        if (!rawNotes.trim()) {
            return toast.warning("Please enter some quick notes first!");
        }

        setIsGenerating(true);
        try {
            const { data } = await axios.post(backendUrl + '/api/ai/clinical-assistant', { notes: rawNotes }, { headers: { dtoken: dToken } });
            
            if (data.success) {
                const ai = data.data;
                setDiagnosis(ai.diagnosisSummary || '');
                setSymptoms(rawNotes);
                setLabTests(ai.recommendedTests?.join(', ') || '');
                setConsultationSummary(ai.consultationSummary || '');
                setFollowUpPlan(ai.followUpPlan || '');
                setCareInstructions(ai.careInstructions || []);
                setRedFlags(ai.redFlags || []);
                setRecommendedTests(ai.recommendedTests || []);
                
                if (ai.prescriptionDraft && ai.prescriptionDraft.length > 0) {
                    setItems(ai.prescriptionDraft.map(p => ({
                        medicine: p.medicine || '',
                        dosage: p.dosage || '',
                        frequency: p.frequency || '',
                        duration: p.duration || '',
                        instructions: p.instruction || ''
                    })));
                }

                if (ai.warnings && ai.warnings.length > 0) {
                    setNote(prev => prev + "\nAI Warnings: " + ai.warnings.join('; '));
                }

                toast.success("AI Assistant has drafted your comprehensive prescription!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("AI Assistant is currently unavailable.");
        } finally {
            setIsGenerating(false);
        }
    };

    const addItem = () => {
        setItems([...items, { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);

    const runSafetyCheck = async () => {
        if (items.some(i => !i.medicine)) {
            return toast.warning("Please add some medicines first!");
        }

        setIsValidating(true);
        try {
            // We should fetch patient history if not available, but modal has 'appointment' which might not have full history.
            // For now, we'll validate based on the current items.
            const { data } = await axios.post(backendUrl + '/api/ai/validate-prescription', { items }, { headers: { dtoken: dToken } });
            
            if (data.success) {
                setValidationResult(data.validation);
                if (data.validation.isSafe) {
                    toast.success("Prescription looks safe!");
                } else {
                    toast.warning("Safety concerns detected!");
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Safety check failed.");
        } finally {
            setIsValidating(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validationResult && !validationResult.isSafe && validationResult.severity === 'High') {
            if (!window.confirm("AI has detected HIGH risk conflicts. Are you sure you want to proceed?")) {
                return;
            }
        }

        onSave({
            appointmentId: appointment._id,
            docId: appointment.docId,
            userId: appointment.userId,
            diagnosis,
            symptoms,
            items,
            labTests,
            consultationSummary,
            followUpPlan,
            careInstructions,
            redFlags,
            recommendedTests,
            followUpDate,
            note
        });
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col font-inter"
            >
                {/* Header */}
                <div className="p-8 bg-[#F8FAFC] border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-[900] text-slate-900 tracking-tight">Create Prescription</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient: {appointment.userData.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                    
                    {/* AI Clinical Assistant Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-[32px] border border-blue-100/50 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">AI Clinical Assistant</h3>
                                    <p className="text-[10px] font-bold text-slate-500">Enter quick notes to auto-draft the prescription</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={handleAIGenerate}
                                disabled={isGenerating}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-xl shadow-blue-500/20"
                            >
                                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                {isGenerating ? 'Analyzing...' : 'Generate with AI'}
                            </button>
                        </div>
                        <textarea 
                            value={rawNotes}
                            onChange={(e) => setRawNotes(e.target.value)}
                            placeholder="e.g. Patient has high fever since 3 days, throat pain, feeling weak. Suggest paracetamol and CBC test."
                            className="w-full p-4 bg-white/60 backdrop-blur-md border border-white rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium placeholder:text-slate-300 min-h-[100px]"
                        />
                    </div>

                    <form id="prescription-form" onSubmit={handleSubmit} className="space-y-10">
                        
                        {/* Clinical Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={14} className="text-primary" /> Diagnosis
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="Enter diagnosis..."
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} className="text-primary" /> Symptoms Summary
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder="Summary of symptoms..."
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Medications Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Pill size={18} className="text-primary" /> Medications (Rx)
                                </h3>
                                <button 
                                    type="button" 
                                    onClick={addItem}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                                >
                                    <Plus size={14} /> Add Medicine
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={index} 
                                        className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-2">
                                                <input 
                                                    required
                                                    placeholder="Medicine Name" 
                                                    value={item.medicine}
                                                    onChange={(e) => updateItem(index, 'medicine', e.target.value)}
                                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                            <div>
                                                <input 
                                                    required
                                                    placeholder="Dosage (e.g. 500mg)" 
                                                    value={item.dosage}
                                                    onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                            <div>
                                                <input 
                                                    required
                                                    placeholder="Frequency (e.g. 1-0-1)" 
                                                    value={item.frequency}
                                                    onChange={(e) => updateItem(index, 'frequency', e.target.value)}
                                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input 
                                                required
                                                placeholder="Duration (e.g. 5 Days)" 
                                                value={item.duration}
                                                onChange={(e) => updateItem(index, 'duration', e.target.value)}
                                                className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            <input 
                                                placeholder="Instructions (e.g. After meal)" 
                                                value={item.instructions}
                                                onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                                                className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        {items.length > 1 && (
                                            <button 
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="absolute -top-2 -right-2 w-8 h-8 bg-white text-rose-500 rounded-full shadow-md flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Clinical Info */}
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles size={14} className="text-primary" /> Patient Advice & Next Steps (AI Generated)
                                </label>
                                <textarea 
                                    rows="3"
                                    value={consultationSummary}
                                    onChange={(e) => setConsultationSummary(e.target.value)}
                                    placeholder="AI will generate advice here..."
                                    className="w-full p-6 bg-blue-50/30 border border-blue-100/50 rounded-3xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all font-medium text-sm leading-relaxed"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Microscope size={14} className="text-primary" /> Recommended Tests
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {recommendedTests.map((test, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                                                    {test}
                                                    <X size={10} className="cursor-pointer hover:text-rose-500" onClick={() => setRecommendedTests(prev => prev.filter((_, idx) => idx !== i))} />
                                                </span>
                                            ))}
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const test = prompt("Enter test name:");
                                                    if(test) setRecommendedTests([...recommendedTests, test]);
                                                }}
                                                className="px-3 py-1.5 border border-dashed border-slate-300 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-wider"
                                            >
                                                + Add Test
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <ListChecks size={14} className="text-primary" /> Care Instructions
                                        </label>
                                        <div className="space-y-2">
                                            {careInstructions.map((inst, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <span className="text-xs font-bold text-slate-600 flex-1">{inst}</span>
                                                    <X size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-rose-500 transition-all" onClick={() => setCareInstructions(prev => prev.filter((_, idx) => idx !== i))} />
                                                </div>
                                            ))}
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const inst = prompt("Enter instruction:");
                                                    if(inst) setCareInstructions([...careInstructions, inst]);
                                                }}
                                                className="w-full py-2 border border-dashed border-slate-300 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-wider"
                                            >
                                                + Add Instruction
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                                            <AlertCircle size={14} className="text-rose-500" /> Red Flags (Urgent)
                                        </label>
                                        <div className="space-y-2">
                                            {redFlags.map((flag, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100 group">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <span className="text-xs font-bold text-rose-700 flex-1">{flag}</span>
                                                    <X size={14} className="text-rose-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-rose-500 transition-all" onClick={() => setRedFlags(prev => prev.filter((_, idx) => idx !== i))} />
                                                </div>
                                            ))}
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const flag = prompt("Enter red flag symptom:");
                                                    if(flag) setRedFlags([...redFlags, flag]);
                                                }}
                                                className="w-full py-2 border border-dashed border-rose-200 text-rose-300 rounded-xl text-[10px] font-black uppercase tracking-wider"
                                            >
                                                + Add Red Flag
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={14} className="text-primary" /> Follow-up Target
                                        </label>
                                        <input 
                                            type="text" 
                                            value={followUpPlan}
                                            onChange={(e) => setFollowUpPlan(e.target.value)}
                                            placeholder="e.g. Visit clinic if symptoms persist for 2 more days"
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all font-medium text-xs"
                                        />
                                        <input 
                                            type="date" 
                                            value={followUpDate}
                                            onChange={(e) => setFollowUpDate(e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all font-medium mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-8 bg-[#F8FAFC] border-t border-slate-100 space-y-6">
                    
                    {/* Validation Result UI */}
                    <AnimatePresence>
                        {validationResult && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-6 rounded-[32px] border ${
                                    validationResult.isSafe ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                                    validationResult.severity === 'High' ? 'bg-rose-50 border-rose-100 text-rose-900' :
                                    'bg-amber-50 border-amber-100 text-amber-900'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <ShieldCheck size={24} className={validationResult.isSafe ? 'text-emerald-500' : 'text-amber-500'} />
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-black uppercase tracking-widest">AI Safety Assessment: {validationResult.isSafe ? 'Passed' : 'Action Required'}</h4>
                                        <p className="text-sm font-medium">{validationResult.recommendations}</p>
                                        {!validationResult.isSafe && (
                                            <ul className="mt-2 space-y-1">
                                                {validationResult.conflicts.map((c, i) => (
                                                    <li key={i} className="text-[11px] font-bold flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-current" /> {c}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center gap-4">
                        <button 
                            type="button"
                            onClick={runSafetyCheck}
                            disabled={isValidating}
                            className="flex items-center gap-2 px-8 py-4 bg-white text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            {isValidating ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} className="text-primary" />}
                            {isValidating ? 'Validating...' : 'AI Safety Check'}
                        </button>
                        <div className="flex gap-4">
                            <button 
                                onClick={onClose}
                                className="px-8 py-4 bg-white text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                form="prescription-form"
                                className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Create Prescription
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PrescriptionModal;
