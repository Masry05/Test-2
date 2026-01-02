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

// Normalize Netlify function path prefixes so routes mounted at '/'
// work for both '/api/*' (redirected) and '/.netlify/functions/api/*'.
app.use((req, _res, next) => {
    if (req.url.startsWith('/.netlify/functions/api')) {
        req.url = req.url.replace('/.netlify/functions/api', '');
    } else if (req.url.startsWith('/api')) {
        req.url = req.url.replace('/api', '');
    }
    next();
});

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

    // Get connection info for debugging
    const mongoUri = process.env.MONGO_URI || '';
    const maskedUri = mongoUri ? 
        mongoUri.substring(0, 14) + '...' + mongoUri.substring(mongoUri.lastIndexOf('@')) : 
        'NOT_SET';

    console.log(`Health Check - DB Status: ${status} (State: ${state})`);
    console.log(`MONGO_URI configured: ${!!process.env.MONGO_URI}`);
    console.log(`Connection host: ${mongoose.connection.host || 'none'}`);
    
    res.json({
        message: 'Numbers Discussion Tree API is running...',
        database: {
            status,
            state,
            host: mongoose.connection.host || 'not connected',
            connectionString: maskedUri,
            mongoUriSet: !!process.env.MONGO_URI
        }
    });
});

// Routes
import authRoutes from './routes/authRoutes';
import treeRoutes from './routes/treeRoutes';

app.use('/auth', authRoutes);
app.use('/', treeRoutes); // /trees, /nodes


export default app;
