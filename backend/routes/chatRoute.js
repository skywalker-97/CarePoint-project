import express from 'express';
import { saveMessage, getMessagesByRoom } from '../controllers/chatController.js';
import authUser from '../middleware/authUser.js';
import authDoctor from '../middleware/authDoctor.js';

const chatRouter = express.Router();

chatRouter.post('/send', saveMessage);
chatRouter.post('/get', getMessagesByRoom);

export default chatRouter;
