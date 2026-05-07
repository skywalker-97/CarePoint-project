import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const doctorSchema = new mongoose.Schema({
    fees: { type: Number, required: true },
}, { strict: false });

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);

async function updateFees() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const doctors = await doctorModel.find({});
        for (const doc of doctors) {
            if (doc.fees < 100) {
                const updatedFee = doc.fees * 10;
                await doctorModel.updateOne({ _id: doc._id }, { $set: { fees: updatedFee } });
                console.log(`Updated doctor ${doc.name} fee from ${doc.fees} to ${updatedFee}`);
            }
        }
        console.log('Finished updating DB fees');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
updateFees();
