import React from 'react';
import { Star, User, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewList = ({ reviews, averageRating, reviewCount }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="py-20 text-center bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
                <Star size={40} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No reviews yet for this specialist</p>
                <p className="text-[10px] text-slate-300 mt-2 font-medium">Reviews can only be left by patients after a completed visit.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header Summary */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Patient Feedback</p>
                    <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">Expert Reviews</h2>
                </div>
                <div className="flex items-center gap-6 bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
                    <div className="text-center px-4 border-r border-slate-100">
                        <p className="text-3xl font-black text-slate-900 leading-none mb-2">{averageRating}</p>
                        <div className="flex items-center justify-center gap-0.5 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} fill={i < Math.floor(averageRating) ? "currentColor" : "none"} />
                            ))}
                        </div>
                    </div>
                    <div className="px-4">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">{reviewCount} Verified Reviews</p>
                        <p className="text-[10px] text-slate-400 font-medium">100% Authentic Patient Experiences</p>
                    </div>
                </div>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((review, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        key={review._id} 
                        className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-premium relative group"
                    >
                        <Quote size={40} className="absolute top-6 right-8 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>

                            <p className="text-slate-700 font-medium leading-relaxed italic">
                                "{review.comment}"
                            </p>

                            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                                    {review.userImage ? (
                                        <img src={review.userImage} alt={review.userName} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={18} className="text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900 tracking-tight">{review.userName}</p>
                                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Verified Patient</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
