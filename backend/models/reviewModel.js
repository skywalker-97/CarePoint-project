import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    docId: { type: String, required: true, ref: 'doctor' },
    userId: { type: String, required: true, ref: 'user' },
    appointmentId: { type: String, required: true, ref: 'appointment', unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    userName: { type: String, required: true },
    userImage: { type: String, default: "" },
}, { timestamps: true });

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);

export default reviewModel;
