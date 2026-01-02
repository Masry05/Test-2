import mongoose from 'mongoose';

// Cached connection for serverless functions
let cachedConnection: typeof mongoose | null = null;

const connectDB = async () => {
    // Check if we have a cached connection and it's still valid
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('✅ Using cached database connection');
        return cachedConnection;
    }

    try {
        const MONGO_URI = process.env.MONGO_URI;
        
        if (!MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }

        console.log('🔄 Creating new database connection...');

        // Mongoose connection options optimized for serverless
        const connection = await mongoose.connect(MONGO_URI, {
            bufferCommands: false, // Disable command buffering for serverless
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
        cachedConnection = connection;
        
        return connection;
    } catch (error: any) {
        console.error('❌ MongoDB Connection Error:', error.message);
        cachedConnection = null;
        // Don't exit process in serverless environment
        throw error;
    }
};

export default connectDB;
