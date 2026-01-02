import serverless from "serverless-http";
import app from "../../src/app";
import connectDB from "../../src/config/db";

// Ensure database connection
connectDB().catch((error) => {
    console.error('❌ Failed to connect to database:', error);
});

// Create serverless handler
const serverlessHandler = serverless(app, {
    basePath: "/.netlify/functions/api",
});

// Export the handler
export const handler = async (event: any, context: any) => {
    // AWS Lambda context reuse optimization
    context.callbackWaitsForEmptyEventLoop = false;
    
    return await serverlessHandler(event, context);
};
