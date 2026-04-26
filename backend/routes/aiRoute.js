import express from 'express';
import { symptomChecker, healthTip } from '../controllers/aiController.js';
import authUser from '../middleware/authUser.js';

const aiRouter = express.Router();

aiRouter.post('/symptom-check', authUser, symptomChecker);
aiRouter.post('/health-tip', authUser, healthTip);

export default aiRouter;
