#!/bin/bash
# Build script for React frontend

echo "Installing Node.js dependencies..."
npm install

echo "Building the React application..."
npm run build

echo "Build completed successfully!"
ls -la dist/
