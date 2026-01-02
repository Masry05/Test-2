# Client Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Expose port (Vite preview port)
EXPOSE 4173

# Start preview command (or serve with nginx in a real prod env, but preview is fine for this)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
