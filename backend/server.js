import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();

const isProduction = process.env.NODE_ENV === "production";

app.use(cookieParser());
app.use(cors({
    origin: isProduction
        ? ['https://my-to-do-app-omega.vercel.app']
        : ['http://localhost:5173'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
