import reviewModel from "../models/reviewModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

const addReview = async (req, res) => {
    try {
        const { userId } = req.body;
        const { appointmentId, rating, comment } = req.body;

        if (!appointmentId || !rating || !comment) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        if (!appointmentData.isCompleted) {
            return res.json({ success: false, message: "You can only review completed appointments" });
        }

        // Check if already reviewed
        const existingReview = await reviewModel.findOne({ appointmentId });
        if (existingReview) {
            return res.json({ success: false, message: "Appointment already reviewed" });
        }

        const reviewData = {
            docId: appointmentData.docId,
            userId,
            appointmentId,
            rating,
            comment,
            userName: appointmentData.userData.name,
            userImage: appointmentData.userData.image
        };

        const newReview = new reviewModel(reviewData);
        await newReview.save();

        // Update doctor rating (optional optimization, could be calculated on fly)
        // For now, we'll just return success and fetch on fly in the profile
        
        res.json({ success: true, message: "Review Submitted" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getDoctorReviews = async (req, res) => {
    try {
        const { docId } = req.body;
        const reviews = await reviewModel.find({ docId }).sort({ createdAt: -1 });
        
        // Calculate average rating
        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        res.json({ success: true, reviews, averageRating, reviewCount: reviews.length });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addReview, getDoctorReviews };
