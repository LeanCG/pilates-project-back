# Dockerfile for Backend development
FROM node:20-slim

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the API port
EXPOSE 3000

# Run in development mode using concurrently as defined in package.json
# But in this container, we only want the backend part.
# The 'dev:server' script uses 'tsx watch src/index.ts'
CMD ["npm", "run", "dev:server"]
