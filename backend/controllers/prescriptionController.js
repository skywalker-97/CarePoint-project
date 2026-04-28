import PDFDocument from 'pdfkit';
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';
import prescriptionModel from '../models/prescriptionModel.js';
import createNotification from '../utils/notify.js';

// API to generate and save prescription
const generatePrescription = async (req, res) => {
    try {
        const { 
            appointmentId, docId, userId, diagnosis, symptoms, items, 
            labTests, consultationSummary, followUpDate, note,
            followUpPlan, careInstructions, redFlags, recommendedTests 
        } = req.body;

        // Check if prescription already exists for this appointment
        const existingPrescription = await prescriptionModel.findOne({ appointmentId });
        if (existingPrescription) {
            return res.json({ success: false, message: "Prescription already exists for this appointment" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        const doctor = await doctorModel.findById(docId);
        const user = await userModel.findById(userId);

        if (!appointment || !doctor || !user) {
            return res.json({ success: false, message: "Invalid Data" });
        }

        // Save to Database
        const prescriptionData = {
            appointmentId, docId, userId, diagnosis, symptoms, items, 
            labTests, consultationSummary, followUpDate, note,
            followUpPlan, careInstructions, redFlags, recommendedTests
        };
        const newPrescription = new prescriptionModel(prescriptionData);
        const savedPrescription = await newPrescription.save();

        // Mark appointment as completed and link prescription
        await appointmentModel.findByIdAndUpdate(appointmentId, { 
            isCompleted: true,
            prescription: savedPrescription._id 
        });

        // Notify patient
        await createNotification(userId, `Prescription is ready! Dr. ${doctor.name} has shared your clinical assessment and medications.`, "prescription", "/my-appointments");

        res.json({ success: true, message: "Prescription Created Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to download PDF prescription
const downloadPrescription = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const prescription = await prescriptionModel.findOne({ appointmentId }).populate('docId').populate('userId');

        if (!prescription) {
            return res.json({ success: false, message: "Prescription not found" });
        }

        const { docId: doctor, userId: user } = prescription;

        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.json({ success: true, pdfBase64: pdfData.toString('base64') });
        });

        // --- PDF Header ---
        doc.fillColor('#2563EB').fontSize(24).text('CarePoint.', { align: 'left' });
        doc.fillColor('#64748B').fontSize(10).text('Premium Healthcare Solutions', 50, 75);
        
        doc.fillColor('#0F172A').fontSize(12).text(`Dr. ${doctor.name}`, 350, 50, { align: 'right' });
        doc.fontSize(10).text(doctor.speciality, 350, 65, { align: 'right' });
        doc.fontSize(10).text(`Reg No: MC-${doctor._id.toString().substring(0,6).toUpperCase()}`, 350, 80, { align: 'right' });

        doc.moveTo(50, 110).lineTo(550, 110).strokeColor('#E2E8F0').stroke();

        // --- Patient Details Section ---
        doc.moveDown(2);
        doc.fillColor('#64748B').fontSize(10).text('PATIENT DETAILS', 50, 130);
        doc.fillColor('#0F172A').fontSize(12).text(user.name, 50, 145);
        doc.fontSize(10).text(`Age/Gender: ${user.dob ? (new Date().getFullYear() - new Date(user.dob).getFullYear()) : 'N/A'} / ${user.gender || 'N/A'}`, 50, 160);
        
        doc.fillColor('#64748B').text('DATE', 450, 130, { align: 'right' });
        doc.fillColor('#0F172A').text(new Date(prescription.createdAt).toLocaleDateString(), 450, 145, { align: 'right' });

        doc.moveDown(3);

        // --- Clinical Assessment ---
        doc.fillColor('#F8FAFC').rect(50, 200, 500, 60).fill();
        doc.fillColor('#64748B').fontSize(9).text('DIAGNOSIS', 65, 215);
        doc.fillColor('#0F172A').fontSize(11).text(prescription.diagnosis, 65, 230);

        doc.moveDown(4);

        // --- Rx Section ---
        doc.fillColor('#2563EB').fontSize(20).text('Rx', 50, 280);
        doc.moveTo(50, 310).lineTo(550, 310).strokeColor('#F1F5F9').stroke();

        let currentY = 330;
        prescription.items.forEach((item, index) => {
            doc.fillColor('#0F172A').fontSize(11).text(`${index + 1}. ${item.medicine}`, 50, currentY, { font: 'Helvetica-Bold' });
            doc.fillColor('#64748B').fontSize(10).text(`${item.dosage} | ${item.frequency} | ${item.duration}`, 50, currentY + 15);
            if (item.instructions) {
                doc.fontSize(9).text(`Note: ${item.instructions}`, 50, currentY + 30, { italic: true });
                currentY += 60;
            } else {
                currentY += 45;
            }
        });

        // --- Additional Info ---
        if (prescription.labTests || prescription.followUpDate || prescription.consultationSummary || prescription.careInstructions?.length > 0) {
            currentY += 20;
            doc.moveTo(50, currentY).lineTo(550, currentY).strokeColor('#F1F5F9').stroke();
            currentY += 20;
            
            if (prescription.consultationSummary) {
                doc.fillColor('#2563EB').fontSize(10).text('DOCTOR ADVICE', 50, currentY, { font: 'Helvetica-Bold' });
                doc.fillColor('#0F172A').fontSize(10).text(prescription.consultationSummary, 50, currentY + 15, { width: 450, lineGap: 2 });
                currentY += 65;
            }

            if (prescription.careInstructions?.length > 0) {
                doc.fillColor('#2563EB').fontSize(10).text('CARE INSTRUCTIONS', 50, currentY, { font: 'Helvetica-Bold' });
                currentY += 15;
                prescription.careInstructions.forEach(instruction => {
                    doc.fillColor('#0F172A').fontSize(10).text(`• ${instruction}`, 50, currentY);
                    currentY += 15;
                });
                currentY += 10;
            }

            if (prescription.redFlags?.length > 0) {
                doc.fillColor('#EF4444').fontSize(10).text('RED FLAGS - SEEK HELP IF:', 50, currentY, { font: 'Helvetica-Bold' });
                currentY += 15;
                prescription.redFlags.forEach(flag => {
                    doc.fillColor('#B91C1C').fontSize(10).text(`! ${flag}`, 50, currentY);
                    currentY += 15;
                });
                currentY += 10;
            }

            if (prescription.followUpPlan) {
                doc.fillColor('#64748B').fontSize(9).text('FOLLOW-UP PLAN', 50, currentY);
                doc.fillColor('#0F172A').fontSize(10).text(prescription.followUpPlan, 50, currentY + 15);
                currentY += 45;
            }

            if (prescription.labTests) {
                doc.fillColor('#64748B').fontSize(9).text('RECOMMENDED LAB TESTS', 50, currentY);
                doc.fillColor('#0F172A').fontSize(10).text(prescription.labTests, 50, currentY + 15);
                currentY += 45;
            }

            if (prescription.followUpDate) {
                doc.fillColor('#64748B').fontSize(9).text('TARGET FOLLOW-UP', 50, currentY);
                doc.fillColor('#0F172A').fontSize(10).text(prescription.followUpDate, 50, currentY + 15);
            }
        }

        // --- Footer / Signature ---
        doc.fontSize(8).fillColor('#CBD5E1').text('Generated by CarePoint Premium Health Network', 50, 700, { align: 'center' });
        
        doc.moveTo(400, 680).lineTo(530, 680).strokeColor('#E2E8F0').stroke();
        doc.fillColor('#0F172A').fontSize(10).text('Digital Signature', 400, 690, { align: 'center', width: 130 });

        // Watermark
        doc.opacity(0.03).fontSize(100).text('CAREPOINT', 50, 350, { rotation: 45 });

        doc.end();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get prescription details for an appointment
const getPrescription = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const prescription = await prescriptionModel.findOne({ appointmentId });
        if (prescription) {
            res.json({ success: true, prescription });
        } else {
            res.json({ success: false, message: "No prescription found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { generatePrescription, downloadPrescription, getPrescription };
