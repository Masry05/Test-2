import serverless from "serverless-http";
import app from "../../src/app";
import connectDB from "../../src/config/db";

// Cache the serverless handler
let handler: any = null;

// Initialize connection and create handler
const getHandler = async () => {
    if (!handler) {
        // Ensure database is connected before creating the handler
        try {
            await connectDB();
            console.log('✅ Handler initialized with database connection');
        } catch (error) {
            console.error('❌ Failed to connect to database:', error);
        }
        
        handler = serverless(app, {
            basePath: "/.netlify/functions/api",
        });
    }
    return handler;
};

// Export the async handler
export const handler = async (event: any, context: any) => {
    const handlerFunction = await getHandler();
    return handlerFunction(event, context);
};
