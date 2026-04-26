import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, Landmark, Wallet, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, amount, doctorName, currency }) => {
    const [step, setStep] = useState('selection'); // 'selection' | 'processing' | 'success'
    const [selectedMethod, setSelectedMethod] = useState('card');

    const handlePayment = () => {
        setStep('processing');
        // Simulate payment gateway delay
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onPaymentSuccess(`TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
            }, 1500);
        }, 2500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[48px] shadow-premium overflow-hidden"
            >
                {step === 'selection' && (
                    <div className="p-10 space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Secure Checkout</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Complete Payment</h3>
                            </div>
                            <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 flex items-center justify-between border border-slate-100">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consultation Fee</p>
                                <p className="text-lg font-black text-slate-900">Dr. {doctorName}</p>
                            </div>
                            <p className="text-2xl font-[900] text-primary">{currency}{amount}</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Select Payment Method</p>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
                                    { id: 'upi', name: 'UPI / QR Code', icon: Wallet },
                                    { id: 'netbanking', name: 'Net Banking', icon: Landmark }
                                ].map((method) => (
                                    <button 
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${selectedMethod === method.id ? 'border-primary bg-primary/5 shadow-premium' : 'border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedMethod === method.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                <method.icon size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700">{method.name}</span>
                                        </div>
                                        {selectedMethod === method.id && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white"><CheckCircle2 size={12} /></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handlePayment}
                            className="w-full py-6 bg-primary text-white rounded-[32px] font-black text-sm uppercase tracking-widest shadow-blue hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                        >
                            Proceed to Pay <ChevronRight size={18} />
                        </button>

                        <div className="flex items-center justify-center gap-2 text-slate-400">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted Transaction</p>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="p-20 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-slate-100 rounded-full" />
                            <Loader2 size={48} className="text-primary animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Processing Payment</h3>
                            <p className="text-slate-400 font-medium text-sm">Please do not refresh the page or close this window.</p>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-20 flex flex-col items-center justify-center text-center space-y-8">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20"
                        >
                            <CheckCircle2 size={48} />
                        </motion.div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Payment Successful</h3>
                            <p className="text-slate-400 font-medium text-sm">Your appointment has been confirmed.</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PaymentModal;
