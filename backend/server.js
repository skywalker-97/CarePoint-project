import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import aiRouter from './routes/aiRoute.js';
import chatRouter from './routes/chatRoute.js';
import prescriptionRouter from './routes/prescriptionRoute.js';
import notificationRouter from './routes/notificationRoute.js';
import invoiceRouter from './routes/invoiceRoute.js';

import { initSocket } from './utils/socket.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const allowedOrigins = [
    'http://localhost:5173',
    'https://carepoint-frontend.onrender.com',
    process.env.FRONTEND_URL
].filter(Boolean);

// Initialize Socket.IO
initSocket(server, allowedOrigins);

connectDB();

// middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.some(allowed => 
            origin === allowed || 
            (typeof origin === 'string' && origin.endsWith('.onrender.com'))
        );

        if (isAllowed) {
            callback(null, true);
        } else {
            console.error('❌ CORS Blocked Origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dtoken']
}));

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/ai', aiRouter);
app.use('/api/chat', chatRouter);
app.use('/api/prescription', prescriptionRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/review', reviewRouter);
app.use('/api/invoice', invoiceRouter);

app.get('/', (req, res) => res.send('API Working'));

server.listen(port, () => {console.log(`Server started on PORT ${port}`)});
