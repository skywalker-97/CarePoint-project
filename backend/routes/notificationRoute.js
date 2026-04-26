import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import authUser from '../middleware/authUser.js';
import authDoctor from '../middleware/authDoctor.js';

const notificationRouter = express.Router();

// Mixed middleware check - would need a more generic one or just separate routes
// For simplicity, I'll provide routes for both
notificationRouter.get('/user', authUser, getNotifications);
notificationRouter.get('/doctor', authDoctor, getNotifications);
notificationRouter.post('/mark-read-user', authUser, markAsRead);
notificationRouter.post('/mark-read-doctor', authDoctor, markAsRead);

export default notificationRouter;
