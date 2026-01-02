import serverless from "serverless-http";
import app from "../../src/app";
import connectDB from "../../src/config/db";

// Connect to database once (cached for subsequent invocations)
connectDB().catch(err => {
    console.error('Database connection error:', err);
});

// Netlify invokes the function at `/.netlify/functions/api/*`.
// Tell serverless-http to strip that base path so our Express
// routes mounted at `/` will match correctly.
export const handler = serverless(app, {
    basePath: "/.netlify/functions/api",
});
