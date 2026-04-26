import notificationModel from "../models/notificationModel.js";

/**
 * Utility to create a notification for a user or doctor.
 * @param {string} userId - The ID of the recipient.
 * @param {string} message - The notification content.
 * @param {string} type - 'success' | 'alert' | 'info' | 'appointment' | 'prescription' | 'approval'
 * @param {string} link - Optional URL for the frontend.
 */
const createNotification = async (userId, message, type = 'info', link = "") => {
    try {
        const notification = new notificationModel({
            userId,
            message,
            type,
            link
        });
        await notification.save();
        console.log(`Notification created for ${userId}: ${message}`);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

export default createNotification;
