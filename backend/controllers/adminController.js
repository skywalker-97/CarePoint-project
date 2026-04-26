import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
import createNotification from '../utils/notify.js';

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to add doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address, image } = req.body;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (!image) {
            return res.json({ success: false, message: "Image Not Selected" });
        }

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: image,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address || '{}'),
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all appointments
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for admin to cancel appointment
const appointmentCancelAdmin = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Cancelled' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to change doctor verification status (Approval Queue)
const changeVerification = async (req, res) => {
    try {
        const { docId } = req.body;
        const doctor = await doctorModel.findById(docId);
        
        // Toggle verification
        const newStatus = !doctor.isVerified;
        await doctorModel.findByIdAndUpdate(docId, { isVerified: newStatus });
        
        // Notify doctor of approval
        if (newStatus) {
            await createNotification(docId, "Congratulations! Your profile has been verified by the CarePoint medical board. You are now live.", "approval");
        }

        res.json({ success: true, message: newStatus ? 'Doctor Verified' : 'Verification Revoked' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});

        // Calculate specialty distribution
        let specialtyCounts = {};
        appointments.forEach(app => {
            const spec = app.docData.speciality;
            specialtyCounts[spec] = (specialtyCounts[spec] || 0) + 1;
        });

        const specialtyData = Object.keys(specialtyCounts).map(spec => ({
            name: spec,
            value: specialtyCounts[spec]
        }));

        const totalRevenue = appointments.reduce((acc, curr) => acc + (curr.isCompleted || curr.payment ? curr.amount : 0), 0);
        const platformCommission = appointments.reduce((acc, curr) => acc + (curr.isCompleted || curr.payment ? (curr.commission || curr.amount * 0.1) : 0), 0);

        const dashData = {
            doctors: doctors.filter(d => d.isVerified).length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 6),
            totalRevenue,
            platformCommission,
            doctorPayouts: totalRevenue - platformCommission,
            approvalQueue: doctors.filter(d => !d.isVerified),
            specialtyData
        };

        res.json({ success: true, dashData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to change doctor availability status
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        const doctor = await doctorModel.findById(docId);
        const newStatus = !doctor.available;
        await doctorModel.findByIdAndUpdate(docId, { available: newStatus });
        res.json({ success: true, message: newStatus ? 'Doctor is now Available' : 'Doctor is now Private' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginAdmin, addDoctor, allDoctors, appointmentsAdmin, appointmentCancelAdmin, adminDashboard, changeVerification, changeAvailability };
