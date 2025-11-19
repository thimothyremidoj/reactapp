# Multi-stage build for Spring Boot application
FROM openjdk:17-jdk-slim as build

WORKDIR /app
COPY todo/pom.xml .
COPY todo/src ./src

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:17-jre-slim

WORKDIR /app

# Create non-root user
RUN groupadd -r todoapp && useradd -r -g todoapp todoapp

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# Create logs directory
RUN mkdir -p logs && chown -R todoapp:todoapp /app

USER todoapp

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]