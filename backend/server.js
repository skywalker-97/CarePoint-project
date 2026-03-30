import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

// middlewares
app.use(express.json());
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'];
app.use(cors({ origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('render.com')) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}}));

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);

app.get('/', (req, res) => res.send('API Working'));

app.listen(port, () => console.log(`Server started on PORT ${port}`));
