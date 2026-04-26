import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true, unique: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    diagnosis: { type: String, required: true },
    symptoms: { type: String, required: true },
    items: [
        {
            medicine: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
            duration: { type: String, required: true },
            instructions: { type: String, default: "" }
        }
    ],
    labTests: { type: String, default: "" },
    followUpDate: { type: String, default: "" },
    note: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const prescriptionModel = mongoose.models.prescription || mongoose.model('prescription', prescriptionSchema);

export default prescriptionModel;
