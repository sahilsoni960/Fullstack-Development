# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

# Use npm ci for clean, reproducible builds
RUN npm ci

COPY . .

# Build the static assets
RUN npm run build

# The output of this stage is the /app/dist directory,
# which can be used by other processes or deployment platforms like Netlify.
