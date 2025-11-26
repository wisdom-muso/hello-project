# Backend Dockerfile for Hillfog Java Application
FROM maven:3.8.6-openjdk-11 AS build

# Set working directory
WORKDIR /app

# Copy the parent pom and core modules
COPY . .

# Build the core-hillfog module first
WORKDIR /app/core-hillfog
RUN mvn clean install -DskipTests

# Build the main application
WORKDIR /app/core-app
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:11-jre

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the built JAR file
COPY --from=build /app/core-app/target/*.jar app.jar

# Copy configuration files
COPY --from=build /app/core-app/resources/ ./resources/

# Create logs directory
RUN mkdir -p /app/logs

# Expose the port
EXPOSE 8088

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8088/login.action || exit 1

# Set JVM options for container environment
ENV JAVA_OPTS="-Xmx512m -Xms256m -Djava.security.egd=file:/dev/./urandom"

# Run the application
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]