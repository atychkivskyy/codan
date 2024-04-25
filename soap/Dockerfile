FROM maven:3.9-eclipse-temurin-17-alpine as build
WORKDIR /app
COPY src ./src
COPY pom.xml .
RUN mvn clean package -DskipTests

FROM openjdk:17
WORKDIR /app
COPY --from=build /app/target/codansoap-0.0.1.jar /app/my-app.jar
EXPOSE 8080
CMD ["java", "-jar", "my-app.jar"]
