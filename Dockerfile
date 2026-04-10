FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install --include=dev

# Copy source code
COPY . .

# Build Vite client
RUN npx vite build

# Expose port
EXPOSE 5000

# Start server with tsx
CMD ["node_modules/.bin/tsx", "server/index.ts"]
