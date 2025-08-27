#!/bin/bash

# Start backend in background
echo "Starting Spring Boot backend..."
java -jar app.jar &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 30

# Start nginx
echo "Starting nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Wait for both processes
wait $BACKEND_PID $NGINX_PID
