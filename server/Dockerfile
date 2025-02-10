# Step 1: Use a builder stage with alpine as the base image
FROM alpine:3.20 AS builder

# Step 2: Install necessary dependencies
RUN apk add --no-cache bash curl gzip openjdk17 tar

# Step 3: Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
ENV PATH=$JAVA_HOME/bin:$PATH

# Step 4: Install Maven
ARG MAVEN_VERSION=3.8.8
ARG MAVEN_DOWNLOAD_URL=https://downloads.apache.org/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz

RUN mkdir -p /usr/share/maven && \
    curl -fsSL "$MAVEN_DOWNLOAD_URL" | tar xzf - -C /usr/share/maven --strip-components=1 && \
    ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

# Set Maven environment variables
ENV MAVEN_HOME=/usr/share/maven
ENV PATH=$MAVEN_HOME/bin:$PATH

# Step 5: Create a working directory for the application
WORKDIR /app

# Step 6: Copy only the pom.xml first to cache dependencies
COPY pom.xml .

# Step 7: Download dependencies only
RUN mvn dependency:go-offline

# Step 8: Copy the source code
COPY src ./src

# Step 9: Build the WAR file
RUN mvn clean package -DskipTests

# Step 10: Create the runtime image
FROM alpine:3.20

# Step 11: Install only the JRE
RUN apk add --no-cache openjdk17-jre

# Step 12: Set working directory
WORKDIR /app

# Step 13: Copy the built WAR from the builder stage
COPY --from=builder /app/target/*.war app.war

# Step 14: Expose the application port
EXPOSE 8080

# Step 15: Run the Spring Boot application
CMD ["java", "-jar", "app.war"]