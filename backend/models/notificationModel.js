import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Can be user, doctor, or admin ID
    message: { type: String, required: true },
    type: { type: String, enum: ['success', 'alert', 'info', 'appointment', 'prescription', 'approval'], default: 'info' },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: "" }, // Optional link to navigate to (e.g. /my-appointments)
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema);

export default notificationModel;
