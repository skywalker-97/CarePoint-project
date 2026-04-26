import express from 'express';
import { generatePrescription, downloadPrescription, getPrescription } from '../controllers/prescriptionController.js';
import authDoctor from '../middleware/authDoctor.js';
import authUser from '../middleware/authUser.js';

const prescriptionRouter = express.Router();

prescriptionRouter.post('/generate', authDoctor, generatePrescription);
prescriptionRouter.post('/download', downloadPrescription);
prescriptionRouter.post('/get', getPrescription);

export default prescriptionRouter;
