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

// app config
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
});

connectDB();

// middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || (typeof origin === 'string' && origin.includes('render.com'))) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}}));

// socket.io connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('send_message', (data) => {
        // data should contain room, message, senderId, etc.
        socket.to(data.roomId).emit('receive_message', data);
    });

    socket.on('typing', (data) => {
        socket.to(data.roomId).emit('user_typing', data);
    });

    socket.on('stop_typing', (data) => {
        socket.to(data.roomId).emit('user_stop_typing', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

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

server.listen(port, () => console.log(`Server started on PORT ${port}`));
