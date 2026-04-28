import doctorModel from '../models/doctorModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import sendEmail from '../config/notifications.js';
import prescriptionModel from '../models/prescriptionModel.js';
import createNotification from '../utils/notify.js';

// API to get all doctors for frontend
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ isVerified: true }).select(['-password']);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        if (!doctor.isVerified) {
            return res.json({ success: false, message: "Account pending verification. Please wait for admin approval." });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req;
        const profileData = await doctorModel.findById(docId).select('-password');

        res.json({ success: true, profileData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available, name, about } = req.body;
        const id = req.docId || docId;

        await doctorModel.findByIdAndUpdate(id, { fees, address, available, name, about });

        res.json({ success: true, message: "Profile Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req;
        const appointments = await appointmentModel.find({ docId });

        res.json({ success: true, appointments });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { docId } = req;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

            // Create Notification
            await createNotification(appointmentData.userId, `Your appointment with Dr. ${appointmentData.docData.name} has been completed.`, "success", "/my-appointments");

            // Sending completion email to patient
            const { to, subject, html } = {
                to: appointmentData.userData.email,
                subject: 'Appointment Completed',
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2 style="color: #10b981;">CarePoint - Appointment Completed</h2>
                        <p>Dear <strong>${appointmentData.userData.name}</strong>,</p>
                        <p>Your appointment with <strong>${appointmentData.docData.name}</strong> has been marked as completed.</p>
                        <p>We hope you had a good experience. Feel free to leave a review!</p>
                        <p>Thank you for choosing CarePoint.</p>
                    </div>
                `
            };

            await sendEmail(to, subject, '', html);

            return res.json({ success: true, message: 'Appointment Completed' });
        } else {
            return res.json({ success: false, message: 'Mark Failed' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { docId } = req;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            
            // Create Notification
            await createNotification(appointmentData.userId, `Dr. ${appointmentData.docData.name} has cancelled your appointment.`, "alert", "/my-appointments");

            return res.json({ success: true, message: 'Appointment Cancelled' });
        } else {
            return res.json({ success: false, message: 'Cancellation Failed' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req;
        const appointments = await appointmentModel.find({ docId });

        let totalEarnings = 0;
        let monthlyEarnings = {}; // { 'Jan': 5000, 'Feb': 3000 }
        let patients = new Set();
        let completedAppointments = 0;
        let cancelledAppointments = 0;
        let patientFrequency = {}; // { userId: count }

        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                totalEarnings += item.amount;
                
                // Group by month for chart
                const month = new Date(item.createdAt).toLocaleString('default', { month: 'short' });
                monthlyEarnings[month] = (monthlyEarnings[month] || 0) + item.amount;
                
                if (item.isCompleted) completedAppointments++;
            }
            if (item.cancelled) cancelledAppointments++;
            
            patients.add(item.userId);
            patientFrequency[item.userId] = (patientFrequency[item.userId] || 0) + 1;
        });

        // Calculate repeat patients
        let repeatPatients = 0;
        Object.values(patientFrequency).forEach(count => {
            if (count > 1) repeatPatients++;
        });

        const totalApps = appointments.length;
        const conversionRate = totalApps > 0 ? ((completedAppointments / totalApps) * 100).toFixed(1) : 0;
        const cancelRate = totalApps > 0 ? ((cancelledAppointments / totalApps) * 100).toFixed(1) : 0;
        const repeatRate = patients.size > 0 ? ((repeatPatients / patients.size) * 100).toFixed(1) : 0;

        // Format chart data
        const chartData = Object.keys(monthlyEarnings).map(month => ({
            name: month,
            earning: monthlyEarnings[month]
        }));

        const dashData = {
            earnings: totalEarnings,
            appointments: totalApps,
            patients: patients.size,
            latestAppointments: appointments.reverse().slice(0, 6),
            stats: {
                conversionRate,
                cancelRate,
                repeatRate,
                completed: completedAppointments
            },
            chartData
        };

        res.json({ success: true, dashData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get patient medical history for doctor panel
const getPatientHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        const prescriptions = await prescriptionModel.find({ userId }).populate('docId', 'name speciality').sort({ createdAt: -1 });

        res.json({ success: true, prescriptions });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { doctorList, loginDoctor, doctorProfile, updateDoctorProfile, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, getPatientHistory };
