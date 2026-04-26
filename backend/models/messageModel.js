import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel', required: true },
    senderModel: { type: String, required: true, enum: ['user', 'doctor'] },
    message: { type: String, required: true },
    fileUrl: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileType: { type: String, default: "" },
    status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const messageModel = mongoose.models.message || mongoose.model('message', messageSchema);

export default messageModel;
