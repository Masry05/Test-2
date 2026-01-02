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
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `GET /trees` - Get all trees
- `GET /trees/:id` - Get specific tree nodes
- `POST /trees` - Create root node
- `POST /nodes` - Create reply node
