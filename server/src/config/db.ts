import mongoose from 'mongoose';

// Cached connection for serverless functions
let cachedConnection: typeof mongoose | null = null;
let isConnecting = false;
let connectionPromise: Promise<any> | null = null;

const connectDB = async () => {
    // Check if we have a cached connection and it's still valid
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('✅ Using cached database connection (state: 1)');
        return cachedConnection;
    }

    // If currently connecting, return the existing promise
    if (isConnecting && connectionPromise) {
        console.log('⏳ Waiting for existing connection attempt...');
        return connectionPromise;
    }

    // If connecting but no promise, wait with timeout
    if (isConnecting) {
        console.log('⏳ Connection in progress, waiting...');
        const timeout = 15000; // 15 seconds
        const start = Date.now();
        return new Promise((resolve, reject) => {
            const checkConnection = setInterval(() => {
                if (mongoose.connection.readyState === 1) {
                    clearInterval(checkConnection);
                    console.log('✅ Connection established after waiting');
                    resolve(cachedConnection);
                } else if (!isConnecting) {
                    clearInterval(checkConnection);
                    reject(new Error('Connection attempt failed'));
                } else if (Date.now() - start > timeout) {
                    clearInterval(checkConnection);
                    reject(new Error('Connection timeout'));
                }
            }, 100);
        });
    }

    // Start new connection
    isConnecting = true;
    
    connectionPromise = (async () => {
        try {
            const MONGO_URI = process.env.MONGO_URI;
            
            if (!MONGO_URI) {
                console.error('❌ MONGO_URI environment variable is not defined');
                throw new Error('MONGO_URI environment variable is not defined');
            }

            console.log('🔄 Creating new database connection...');

            // Mongoose connection options optimized for serverless
            const connection = await mongoose.connect(MONGO_URI, {
                bufferCommands: false, // Disable command buffering for serverless
                maxPoolSize: 10,
                minPoolSize: 2,
                serverSelectionTimeoutMS: 15000, // Increased to 15 seconds
                socketTimeoutMS: 45000,
                connectTimeoutMS: 15000, // Add connection timeout
                family: 4, // Use IPv4, skip trying IPv6
            });

            // Set up event handlers to maintain connection (only once)
            if (!mongoose.connection.listenerCount('connected')) {
                mongoose.connection.on('connected', () => {
                    console.log('🔗 Mongoose connected event fired');
                });

                mongoose.connection.on('error', (err) => {
                    console.error('❌ Mongoose connection error:', err.message);
                    cachedConnection = null;
                    connectionPromise = null;
                });

                mongoose.connection.on('disconnected', () => {
                    console.warn('⚠️  Mongoose disconnected event fired');
                    cachedConnection = null;
                    connectionPromise = null;
                });

                mongoose.connection.on('reconnected', () => {
                    console.log('🔄 Mongoose reconnected');
                });
            }

            console.log(`✅ MongoDB Connected successfully!`);
            console.log(`   Host: ${connection.connection.host}`);
            console.log(`   DB Name: ${connection.connection.name}`);
            console.log(`   Ready State: ${connection.connection.readyState}`);
            
            cachedConnection = connection;
            isConnecting = false;
            
            return connection;
        } catch (error: any) {
            console.error('❌ MongoDB Connection Error:', error.message);
            console.error('   Error name:', error.name);
            if (error.reason) {
                console.error('   Reason:', error.reason);
            }
            isConnecting = false;
            cachedConnection = null;
            connectionPromise = null;
            throw error;
        }
    })();

    return connectionPromise;
};

export default connectDB;
