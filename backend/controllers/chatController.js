import messageModel from "../models/messageModel.js";

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

        res.json({ success: true, message: "Message Sent" });
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
