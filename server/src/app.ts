import express from 'express';
import cors from 'cors';

const app = express();

const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Middleware to handle Buffer body from Netlify
app.use((req, _res, next) => {
    if (req.body && Buffer.isBuffer(req.body)) {
        try {
            const bodyString = req.body.toString('utf-8');
            req.body = JSON.parse(bodyString);
        } catch (error) {
            console.error('Failed to parse Buffer body:', error);
        }
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import mongoose from 'mongoose';
import connectDB from './config/db';

app.get('/', async (req, res) => {
    try {
        // Try to ensure connection before checking state
        await connectDB();
    } catch (error: any) {
        console.error('Health check connection attempt failed:', error.message);
    }

    const state = mongoose.connection.readyState;
    const statusMap: { [key: number]: string } = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting',
    };
    const status = statusMap[state] || 'Unknown';

    console.log(`Health Check - DB Status: ${status} (State: ${state})`);
    
    res.json({
        message: 'Numbers Discussion Tree API is running...',
        database: {
            status,
            state
        }
    });
});

// Routes
import authRoutes from './routes/authRoutes';
import treeRoutes from './routes/treeRoutes';

app.use('/auth', authRoutes);
app.use('/', treeRoutes); // /trees, /nodes


export default app;
