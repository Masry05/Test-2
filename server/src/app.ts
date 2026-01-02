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
app.use(express.json());

import mongoose from 'mongoose';

app.get('/', (req, res) => {
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

app.use('/api/auth', authRoutes);
app.use('/api', treeRoutes); // /api/trees, /api/nodes


export default app;
