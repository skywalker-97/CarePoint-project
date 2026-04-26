import express from 'express';
import { generateInvoice } from '../controllers/invoiceController.js';
import authUser from '../middleware/authUser.js';

const invoiceRouter = express.Router();

invoiceRouter.post('/download', authUser, generateInvoice);

export default invoiceRouter;
