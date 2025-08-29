@echo off
echo 🚀 Starting Local Test Server for Frontend...

REM 1. Build the frontend application
echo 📦 Building frontend assets...
call npm run build

REM 2. Start the local test server
REM This server will serve the built assets and proxy API calls to the local backend.
echo 🌐 Starting Node.js test server...
node test-server.js
