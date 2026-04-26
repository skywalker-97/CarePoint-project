import express from 'express';
import { loginAdmin, addDoctor, allDoctors, appointmentsAdmin, appointmentCancelAdmin, adminDashboard, changeVerification, changeAvailability } from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js';

console.log('Loading adminRoute.js...');
const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.post('/add-doctor', authAdmin, addDoctor);
adminRouter.get('/all-doctors', authAdmin, allDoctors);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin);
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancelAdmin);
adminRouter.get('/dashboard', authAdmin, adminDashboard);
adminRouter.post('/change-verification', authAdmin, changeVerification);
adminRouter.post('/change-availability', authAdmin, changeAvailability);

export default adminRouter;
