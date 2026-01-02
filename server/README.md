# Numbers Discussion Tree API - Server

A RESTful API for managing discussion trees with numeric values and operations.

## 🚀 Deployment on Netlify

### Prerequisites

- Netlify account
- MongoDB Atlas account (or any MongoDB instance)
- Netlify CLI (optional): `npm install -g netlify-cli`

### Quick Deploy

1. **Connect to Netlify**

   - Push your code to GitHub/GitLab/Bitbucket
   - Go to [Netlify](https://app.netlify.com/) and click "Add new site"
   - Import your repository
   - Netlify will auto-detect the configuration from `netlify.toml`

2. **Configure Environment Variables**
   Go to Site Settings → Environment Variables and add:

   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/numbers-tree?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=https://your-client-url.netlify.app
   NODE_ENV=production
   ```

3. **MongoDB Atlas Setup** (Important!)

   - Go to MongoDB Atlas → Network Access
   - Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
   - This is required for Netlify's serverless functions

4. **Deploy**
   - Click "Deploy site"
   - Your API will be available at: `https://your-site.netlify.app/api`

### CLI Deployment (Alternative)

```bash
# Login to Netlify
netlify login

# Deploy
cd server
netlify deploy --prod
```

### API Endpoints

After deployment, your endpoints will be:

- Health check: `https://your-site.netlify.app/`
- Auth: `https://your-site.netlify.app/auth/register`, `/auth/login`
- Trees: `https://your-site.netlify.app/trees`
- Nodes: `https://your-site.netlify.app/nodes`

## 🧪 Running Tests

To run the integration tests for the backend (checking business scenarios):

```bash
npm test
```

This requires a MongoDB instance running locally (default: `mongodb://localhost:27017/numbers-tree-test`).
The tests cover:

- Unregistered user capabilities
- Authentication (Register/Login)
- Tree and Node creation
- Edge cases (e.g. divide by zero)

## 💻 Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 📁 Project Structure

```
server/
├── netlify/
│   └── functions/
│       └── api.ts          # Netlify serverless function entry point
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Local development server
│   ├── config/
│   │   └── db.ts           # MongoDB connection with caching
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   └── routes/             # API routes
├── netlify.toml            # Netlify configuration
└── package.json

```
