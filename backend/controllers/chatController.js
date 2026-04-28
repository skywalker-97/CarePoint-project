import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API to save a message
const saveMessage = async (req, res) => {
    try {
        const { roomId, senderId, senderModel, message, fileUrl, fileName, fileType } = req.body;

        if (!roomId || !senderId || !senderModel || (!message && !fileUrl)) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const messageData = {
            roomId,
            senderId,
            senderModel,
            message,
            fileUrl,
            fileName,
            fileType,
            status: 'sent'
        };

        const newMessage = new messageModel(messageData);
        await newMessage.save();

        let aiResponseData = null;
        let severity = 'NORMAL';

        // Trigger AI Chatbot logic for support room
        if (roomId === 'carepoint_support' && senderModel === 'user') {
            const user = await userModel.findById(senderId);
            const history = await messageModel.find({ roomId }).sort({ createdAt: 1 }).limit(10);
            
            const historyText = history.map(m => `${m.senderModel}: ${m.message}`).join('\n');
            
            const prompt = `You are CarePoint AI, an intelligent medical triage assistant. Your goal is to provide helpful, specific initial non-diagnostic advice based on the patient's symptoms and determine the severity of the case.
            
            Patient Profile:
            - Age: ${user?.dob && user.dob !== "Not Selected" ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 'Unknown'}
            - Gender: ${user?.gender || 'Unknown'}
            - Medical History: ${user?.medicalHistory && user.medicalHistory.length > 0 ? user.medicalHistory.join(', ') : 'None reported'}
            
            Recent Chat History for Context:
            ${historyText}
            
            LATEST MESSAGE FROM PATIENT: 
            "${message}"
            
            Instructions:
            1. You MUST directly answer the LATEST MESSAGE. Do not just greet the user if they have provided a symptom. Give them actionable, helpful medical advice.
            2. Analyze the latest message and determine severity:
              - NORMAL: Routine questions, minor symptoms.
              - PRIORITY: Needs doctor consultation soon, but not life-threatening.
              - EMERGENCY: Urgent, life-threatening symptoms.
            
            You MUST end your response exactly with one of these tags: [NORMAL], [PRIORITY], or [EMERGENCY].
            Do NOT include anything else after the tag.`;

            const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
            const result = await model.generateContent(prompt);
            let aiText = result.response.text();
            
            // Extract severity
            if (aiText.includes('[EMERGENCY]')) { severity = 'EMERGENCY'; }
            else if (aiText.includes('[PRIORITY]')) { severity = 'PRIORITY'; }
            
            // Clean AI text
            aiText = aiText.replace(/\[NORMAL\]|\[PRIORITY\]|\[EMERGENCY\]/g, '').trim();

            const aiMessageData = {
                roomId,
                senderId: new mongoose.Types.ObjectId("000000000000000000000000"), // Dummy ID for AI
                senderModel: 'doctor',
                message: aiText,
                status: 'sent',
                createdAt: new Date().toISOString()
            };
            
            const aiMessage = new messageModel(aiMessageData);
            await aiMessage.save();
            
            aiResponseData = aiMessageData;
        }

        res.json({ success: true, message: "Message Sent", aiResponse: aiResponseData, severity });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get messages for a room
const getMessagesByRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        const messages = await messageModel.find({ roomId }).sort({ createdAt: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { saveMessage, getMessagesByRoom };
