import notificationModel from "../models/notificationModel.js";

// API to get notifications for a user/doctor
const getNotifications = async (req, res) => {
    try {
        const userId = req.userId || req.docId; // Support both patient and doctor
        const notifications = await notificationModel.find({ userId }).sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, notifications });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to mark notifications as read
const markAsRead = async (req, res) => {
    try {
        const userId = req.userId || req.docId;
        await notificationModel.updateMany({ userId, isRead: false }, { isRead: true });
        res.json({ success: true, message: "Notifications marked as read" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getNotifications, markAsRead };
