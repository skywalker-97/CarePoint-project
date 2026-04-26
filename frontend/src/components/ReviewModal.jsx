import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquare, Send } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, onSubmit, doctorName }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Feedback</p>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review {doctorName}</h2>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">
                        {/* Star Rating */}
                        <div className="space-y-4 text-center">
                            <p className="text-sm font-bold text-slate-500">How was your experience?</p>
                            <div className="flex items-center justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        onClick={() => setRating(star)}
                                        className="p-1 transition-transform active:scale-90"
                                    >
                                        <Star 
                                            size={40} 
                                            className={`${(hover || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text Review */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-slate-400 ml-1">
                                <MessageSquare size={16} />
                                <label className="text-[10px] font-black uppercase tracking-widest">Your Comments</label>
                            </div>
                            <textarea 
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Share your experience with other patients..."
                                className="w-full h-32 p-5 bg-slate-50/50 rounded-3xl border border-slate-100 focus:border-primary focus:bg-white outline-none font-medium text-slate-700 transition-all resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            onClick={() => onSubmit(rating, review)}
                            disabled={!rating || !review.trim()}
                            className="w-full py-5 bg-primary text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
                        >
                            <Send size={18} /> Submit Review
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReviewModal;
