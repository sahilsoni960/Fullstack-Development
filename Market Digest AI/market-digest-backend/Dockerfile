# Use Java 17 base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven files first for better caching
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build the application
RUN mvn clean package -DskipTests

# Copy the built JAR
COPY target/market-digest-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variables
ENV PORT=8080

# Run the application
CMD ["java", "-jar", "app.jar"]
