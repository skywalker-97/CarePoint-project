import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import sendEmail from '../config/notifications.js';
import createNotification from '../utils/notify.js';

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, dob, gender, address } = req.body;
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" });
        }

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists with this email" });
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            phone: phone || "0000000000",
            dob: dob || "Not Selected",
            gender: gender || "Not Selected",
            address: address ? JSON.parse(address) : { line1: '', line2: '' }
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');

        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender, image, medicalHistory } = req.body;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        const updateData = { name, phone, address: JSON.parse(address || '{}'), dob, gender, medicalHistory };
        if (image) {
            updateData.image = image;
        }

        await userModel.findByIdAndUpdate(userId, updateData);

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        const doctorInfo = await doctorModel.findById(docId);
        if (!doctorInfo.isVerified) {
            return res.json({ success: false, message: "Doctor is not yet verified by the medical board." });
        }

        // --- ATOMIC SLOT BOOKING LOGIC ---
        const updateDoc = await doctorModel.findOneAndUpdate(
            { 
                _id: docId, 
                available: true,
                isVerified: true,
                [`slots_booked.${slotDate}`]: { $ne: slotTime } 
            },
            { 
                $addToSet: { [`slots_booked.${slotDate}`]: slotTime } 
            },
            { new: true }
        );

        if (!updateDoc) {
            return res.json({ success: false, message: 'Slot no longer available or Doctor unavailable' });
        }

        const userData = await userModel.findById(userId).select('-password');
        const docData = await doctorModel.findById(docId).select('-password -slots_booked');

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            commission: docData.fees * 0.1, // 10% platform commission
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Create Notifications
        await createNotification(userId, `Appointment confirmed with Dr. ${docData.name} for ${slotDate} at ${slotTime}.`, "appointment", "/my-appointments");
        await createNotification(docId, `New appointment booked by ${userData.name} for ${slotDate} at ${slotTime}.`, "appointment", "/doctor-appointments");

        // Sending confirmation email
        const { to, subject, html } = {
            to: userData.email,
            subject: 'Appointment Booked Successfully',
            html: `
                <div style="font-family: 'Inter', sans-serif; padding: 40px; background-color: #F8FAFC;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                        <h1 style="color: #2563EB; margin-bottom: 20px;">CarePoint.</h1>
                        <h2 style="color: #0F172A; font-weight: 900;">Appointment Confirmed</h2>
                        <p style="color: #64748B; font-size: 16px; line-height: 1.6;">Hi ${userData.name}, your visit with <strong>Dr. ${docData.name}</strong> is scheduled.</p>
                        
                        <div style="background-color: #F1F5F9; border-radius: 16px; padding: 24px; margin: 30px 0;">
                            <p style="margin: 0; color: #64748B; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Date & Time</p>
                            <p style="margin: 8px 0 0 0; color: #0F172A; font-size: 20px; font-weight: 900;">${slotDate} at ${slotTime}</p>
                        </div>

                        <p style="color: #64748B; font-size: 14px;">Please arrive 15 minutes early. If you need to cancel, please do so at least 2 hours in advance.</p>
                        
                        <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
                        <p style="color: #94A3B8; font-size: 12px; text-align: center;">CarePoint Premium Health Network &copy; 2026</p>
                    </div>
                </div>
            `
        };

        await sendEmail(to, subject, '', html);

        res.json({ success: true, message: "Appointment Booked Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get user appointments
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        // Notifications
        await createNotification(userId, `You cancelled your appointment with Dr. ${appointmentData.docData.name}.`, "alert", "/my-appointments");
        await createNotification(docId, `Patient ${appointmentData.userData.name} has cancelled their appointment for ${slotDate} at ${slotTime}.`, "alert", "/doctor-appointments");

        res.json({ success: true, message: 'Appointment Cancelled' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to verify payment (Simulated)
const verifyPayment = async (req, res) => {
    try {
        const { userId, appointmentId, transactionId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        if (transactionId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true, transactionId });
            
            // Notification
            await createNotification(userId, `Payment successful for appointment with Dr. ${appointmentData.docData.name}.`, "success", "/my-appointments");
            
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, verifyPayment };
