# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install mysql-client so that mysqladmin is available
RUN apk update \
    && apk add --no-cache mysql-client

# Copy necessary files from builder
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/drizzle/ ./drizzle

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Needed for drizzle-kit
RUN npm install

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"] 