import PDFDocument from 'pdfkit';
import appointmentModel from '../models/appointmentModel.js';

const generateInvoice = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment || !appointment.payment) {
            return res.json({ success: false, message: "Invoice not available or payment pending" });
        }

        const doc = new PDFDocument({ margin: 50 });
        let chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        
        doc.on('end', () => {
            const pdfBase64 = Buffer.concat(chunks).toString('base64');
            res.json({ success: true, pdfBase64 });
        });

        // Branding
        doc.fillColor('#2563EB').fontSize(24).font('Helvetica-Bold').text('CarePoint.', 50, 50);
        doc.fillColor('#64748B').fontSize(10).font('Helvetica').text('Premium Healthcare Network', 50, 80);
        
        doc.fillColor('#0F172A').fontSize(20).font('Helvetica-Bold').text('INVOICE', 400, 50, { align: 'right' });
        doc.fontSize(10).font('Helvetica').text(`Invoice #: INV-${appointment._id.toString().substr(-6).toUpperCase()}`, 400, 80, { align: 'right' });
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, 95, { align: 'right' });

        doc.moveTo(50, 130).lineTo(550, 130).stroke('#E2E8F0');

        // Billing Details
        doc.fillColor('#64748B').fontSize(10).text('BILLED TO', 50, 160);
        doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text(appointment.userData.name, 50, 175);
        doc.fontSize(10).font('Helvetica').text(appointment.userData.email, 50, 190);

        doc.fillColor('#64748B').fontSize(10).text('PROVIDER', 350, 160);
        doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text(`Dr. ${appointment.docData.name}`, 350, 175);
        doc.fontSize(10).font('Helvetica').text(appointment.docData.speciality, 350, 190);

        // Table Header
        doc.rect(50, 240, 500, 30).fill('#F8FAFC');
        doc.fillColor('#64748B').fontSize(10).font('Helvetica-Bold').text('Description', 70, 250);
        doc.text('Date', 300, 250);
        doc.text('Amount', 450, 250, { align: 'right' });

        // Table Content
        doc.fillColor('#0F172A').font('Helvetica').text(`Medical Consultation - Dr. ${appointment.docData.name}`, 70, 285);
        doc.text(appointment.slotDate, 300, 285);
        doc.text(`$${appointment.amount}.00`, 450, 285, { align: 'right' });

        doc.moveTo(50, 310).lineTo(550, 310).stroke('#E2E8F0');

        // Total
        doc.fontSize(12).font('Helvetica-Bold').text('Total Paid', 350, 340);
        doc.fontSize(12).font('Helvetica-Bold').text(`$${appointment.amount}.00`, 450, 340, { align: 'right' });

        // Footer
        doc.rect(50, 650, 500, 80).fill('#F1F5F9');
        doc.fillColor('#475569').fontSize(10).font('Helvetica-Bold').text('Thank you for trusting CarePoint.', 70, 670);
        doc.fontSize(8).font('Helvetica').text('This is a computer-generated invoice and does not require a physical signature.', 70, 685);
        doc.text('For billing inquiries: support@carepoint.com', 70, 700);

        doc.end();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { generateInvoice };
