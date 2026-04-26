import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, Pill, Calendar, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PrescriptionModal = ({ appointment, onClose, onSave }) => {
    const [diagnosis, setDiagnosis] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [labTests, setLabTests] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [note, setNote] = useState('');
    const [items, setItems] = useState([
        { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            appointmentId: appointment._id,
            docId: appointment.docId,
            userId: appointment.userId,
            diagnosis,
            symptoms,
            items,
            labTests,
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={14} className="text-primary" /> Recommended Lab Tests
                                </label>
                                <textarea 
                                    rows="2"
                                    value={labTests}
                                    onChange={(e) => setLabTests(e.target.value)}
                                    placeholder="Enter lab tests if any..."
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={14} className="text-primary" /> Follow-up Date
                                </label>
                                <input 
                                    type="date" 
                                    value={followUpDate}
                                    onChange={(e) => setFollowUpDate(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-8 bg-[#F8FAFC] border-t border-slate-100 flex justify-end gap-4">
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
            </motion.div>
        </div>
    );
};

export default PrescriptionModal;
