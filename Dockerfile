# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install required system packages and pnpm
RUN apk add --no-cache curl && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript code
RUN pnpm run build

# Expose port (match your Express app)
EXPOSE 8080

# Start the application
CMD ["pnpm", "start"]