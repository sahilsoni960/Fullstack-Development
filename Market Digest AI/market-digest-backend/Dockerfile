# Multi-stage build for Market Digest AI backend

# 1) Build stage: compile the Spring Boot app
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy sources from the current build context (backend folder)
COPY pom.xml ./
COPY src ./src

# Build the JAR
RUN mvn -B -DskipTests clean package

# 2) Runtime stage: minimal JRE image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built JAR from the build stage (match any .jar)
COPY --from=build /workspace/target/*.jar app.jar

# Expose port and run
EXPOSE 8080
ENV PORT=8080
CMD ["java", "-jar", "app.jar"]
