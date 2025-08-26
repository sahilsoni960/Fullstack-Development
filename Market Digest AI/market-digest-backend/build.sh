#!/bin/bash
# Build script for Render deployment

echo "Installing Maven dependencies..."
mvn dependency:resolve

echo "Building the application..."
mvn clean package -DskipTests

echo "Build completed successfully!"
ls -la target/
