# Multi-stage build for both backend and frontend
FROM openjdk:17-jdk-slim as backend-builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY ../market-digest-frontend/package*.json ./
RUN npm ci
COPY ../market-digest-frontend/ ./
RUN npm run build

FROM openjdk:17-jdk-slim
WORKDIR /app

# Install nginx for serving frontend
RUN apt-get update && apt-get install -y nginx

# Copy backend JAR
COPY --from=backend-builder /app/target/market-digest-backend-0.0.1-SNAPSHOT.jar app.jar

# Copy frontend build
COPY --from=frontend-builder /app/dist /var/www/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 8080 80

# Start both services
COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"]
