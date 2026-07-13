# Build stage
FROM maven:3.9.6-eclipse-temurin-25-alpine AS build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -B

# Run stage
FROM eclipse-temurin:25-jre-alpine

RUN mkdir -p /var/log/wildledger
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["java", "-jar", "app.jar"]
