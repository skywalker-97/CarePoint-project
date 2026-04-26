import express from 'express';
import { addReview, getDoctorReviews } from '../controllers/reviewController.js';
import authUser from '../middleware/authUser.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, addReview);
reviewRouter.post('/get-doctor-reviews', getDoctorReviews);

export default reviewRouter;
