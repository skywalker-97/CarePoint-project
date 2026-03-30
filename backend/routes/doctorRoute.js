import express from 'express';
import { doctorList, loginDoctor, doctorProfile, updateDoctorProfile, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);

export default doctorRouter;
