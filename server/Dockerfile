# Step 1: Use alpine as the base image
FROM alpine:3.20 AS base

# Step 2: Install necessary dependencies (bash, curl, tar, gzip)
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

# Step 6: Copy pom.xml file
COPY pom.xml .

# Step 7: Build the application dependencies
RUN mvn dependency:go-offline

# Step 8: Copy the rest of the application source code
COPY src ./src

# Step 9: Expose the port your Spring Boot app runs on (default is 8080)
EXPOSE 8080

# Step 10: Set the entrypoint to run the Spring Boot application using Maven
CMD ["mvn", "spring-boot:run"]