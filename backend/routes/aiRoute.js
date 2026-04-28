import express from 'express';
import { symptomChecker, healthTip, clinicalAssistant, summarizeMedicalHistory, analyzeEmergencyRisk, getRecommendedDoctors, validatePrescription, predictNoShow, predictFollowUp, getRevenueIntelligence, getHealthScore } from '../controllers/aiController.js';
import authUser from '../middleware/authUser.js';
import authDoctor from '../middleware/authDoctor.js';
import authAdmin from '../middleware/authAdmin.js';

const aiRouter = express.Router();

aiRouter.post('/symptom-check', authUser, symptomChecker);
aiRouter.post('/health-tip', authUser, healthTip);
aiRouter.post('/clinical-assistant', authDoctor, clinicalAssistant);
aiRouter.post('/summarize-history', authDoctor, summarizeMedicalHistory);
aiRouter.post('/emergency-risk', authUser, analyzeEmergencyRisk);
aiRouter.post('/recommend-doctors', authUser, getRecommendedDoctors);
aiRouter.post('/validate-prescription', authDoctor, validatePrescription);
aiRouter.post('/predict-no-show', authDoctor, predictNoShow);
aiRouter.post('/predict-followup', authDoctor, predictFollowUp);
aiRouter.post('/revenue-intelligence', authAdmin, getRevenueIntelligence);
aiRouter.post('/health-score', authUser, getHealthScore);

export default aiRouter;
