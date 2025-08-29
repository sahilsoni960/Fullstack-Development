#!/bin/bash

echo "🚀 Starting Local Test Server for Frontend..."

# 1. Build the frontend application
echo "📦 Building frontend assets..."
npm run build

# 2. Start the local test server
# This server will serve the built assets and proxy API calls to the local backend.
echo "🌐 Starting Node.js test server..."
node test-server.js
