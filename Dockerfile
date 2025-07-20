# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript code
RUN pnpm run build

# Expose port 8080 (matching the server configuration)
EXPOSE 8080

# Start the application
CMD ["pnpm", "start"] 