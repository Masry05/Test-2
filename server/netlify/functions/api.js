"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serverless_http_1 = __importDefault(require("serverless-http"));
const app_1 = __importDefault(require("../../src/app"));
const db_1 = __importDefault(require("../../src/config/db"));
// Connect to database once (cached for subsequent invocations)
(0, db_1.default)().catch(err => {
    console.error('Database connection error:', err);
});
// Netlify invokes the function at `/.netlify/functions/api/*`.
// Tell serverless-http to strip that base path so our Express
// routes mounted at `/` will match correctly.
exports.handler = (0, serverless_http_1.default)(app_1.default, {
    basePath: "/.netlify/functions/api",
});
