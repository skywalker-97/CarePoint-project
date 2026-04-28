import notificationModel from "../models/notificationModel.js";
import { emitToUser } from "./socket.js";

/**
 * Utility to create a notification for a user or doctor.
 * @param {string} userId - The ID of the recipient.
 * @param {string} message - The notification content.
 * @param {string} type - 'success' | 'alert' | 'info' | 'appointment' | 'prescription' | 'approval'
 * @param {string} link - Optional URL for the frontend.
 */
/**
 * Utility to notify all admins via the admin room.
 */
const notifyAdmin = (message, type = 'info', data = {}) => {
    emitToUser('admin_room', 'notification', {
        message,
        type,
        ...data,
        createdAt: new Date(),
        isAdmin: true
    });
};

const createNotification = async (userId, message, type = 'info', link = "", notifyAdminsToo = false) => {
    try {
        const notification = new notificationModel({
            userId,
            message,
            type,
            link
        });
        await notification.save();
        
        const payload = {
            _id: notification._id,
            message,
            type,
            link,
            createdAt: notification.createdAt,
            isRead: false
        };

        // Emit real-time notification to user
        emitToUser(userId, 'notification', payload);

        // Optionally notify admins
        if (notifyAdminsToo) {
            notifyAdmin(message, type, { link, userId });
        }

        console.log(`Notification created and emitted for ${userId}: ${message}`);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

export { notifyAdmin };
export default createNotification;
