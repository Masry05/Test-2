import mongoose from 'mongoose';

// Cached connection for serverless functions
let cachedConnection: typeof mongoose | null = null;
let isConnecting = false;

const connectDB = async () => {
    // Check if we have a cached connection and it's still valid
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('✅ Using cached database connection');
        return cachedConnection;
    }

    // If already connecting, wait for it
    if (isConnecting) {
        console.log('⏳ Waiting for existing connection attempt...');
        return new Promise((resolve, reject) => {
            const checkConnection = setInterval(() => {
                if (mongoose.connection.readyState === 1) {
                    clearInterval(checkConnection);
                    resolve(cachedConnection);
                } else if (!isConnecting) {
                    clearInterval(checkConnection);
                    reject(new Error('Connection attempt failed'));
                }
            }, 100);
        });
    }

    try {
        isConnecting = true;
        const MONGO_URI = process.env.MONGO_URI;
        
        if (!MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }

        console.log('🔄 Creating new database connection...');
        console.log('📍 Connection string:', MONGO_URI.substring(0, 25) + '...');

        // Mongoose connection options optimized for serverless
        const connection = await mongoose.connect(MONGO_URI, {
            bufferCommands: false, // Disable command buffering for serverless
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
        });

        // Set up event handlers to maintain connection
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
            cachedConnection = null;
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  Mongoose disconnected');
            cachedConnection = null;
        });

        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
        cachedConnection = connection;
        isConnecting = false;
        
        return connection;
    } catch (error: any) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('Stack:', error.stack);
        isConnecting = false;
        cachedConnection = null;
        throw error;
    }
};

export default connectDB;
