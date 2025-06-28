FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY workers/notification-worker/package*.json ./

# Install all dependencies (needed for building)
RUN npm install

# Copy source code
COPY workers/notification-worker/src ./src
COPY workers/notification-worker/tsconfig*.json ./
COPY workers/notification-worker/nest-cli.json ./

# Build the application
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY workers/notification-worker/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Create log directory
RUN mkdir -p /var/log/notification-worker

# Run the application
CMD ["node", "dist/main"]