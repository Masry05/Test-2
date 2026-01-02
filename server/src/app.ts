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

app.get('/', (req, res) => {
    res.send('Numbers Discussion Tree API is running...');
});

// Routes
import authRoutes from './routes/authRoutes';
import treeRoutes from './routes/treeRoutes';

app.use('/api/auth', authRoutes);
app.use('/api', treeRoutes); // /api/trees, /api/nodes


export default app;
