# Numbers Discussion Tree

A full-stack recursive discussion tree where users converse using arithmetic operations.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, Zod, JWT.
- **Frontend**: Vite, React, TypeScript, Axios.

## Prerequisites
- Node.js (v14+)
- MongoDB running locally on `mongodb://localhost:27017`

## Setup & Run

### 1. Backend
```bash
cd server
npm install
npm run dev
```
Server runs on http://localhost:5000.

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on http://localhost:5173.

## Features
- Register/Login
- Start a new calculation tree (Root Node)
- Reply to any node with an Operation (+, -, *, /) and a Number.
- Automatic calculation validation (Zero division prevention).
- Recursive visualization of the discussion.

## API Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/trees` - Get all trees
- `GET /api/trees/:id` - Get specific tree nodes
- `POST /api/trees` - Create root node
- `POST /api/nodes` - Create reply node
