# Build đa giai đoạn để tối ưu kích thước và hiệu suất
# Giai đoạn 1: Build ứng dụng với Maven
FROM eclipse-temurin:17-jdk-alpine AS build

# Cài đặt Maven
RUN apk add --no-cache maven

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy pom.xml trước để tận dụng cache của Docker
COPY pom.xml .

# Tải dependencies (layer này sẽ được cache nếu pom.xml không thay đổi)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build ứng dụng (bỏ qua test để build nhanh hơn)
RUN mvn clean package -DskipTests

# Giai đoạn 2: Runtime chỉ với JRE
FROM eclipse-temurin:17-jre-alpine

# Cài đặt curl cho health check (khuyến nghị cho Render)
RUN apk add --no-cache curl

# Tạo user không có quyền root để bảo mật
RUN addgroup -g 1000 spring && adduser -u 1000 -G spring -s /bin/sh -D spring

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy fonts (nếu ứng dụng cần)
COPY src/main/resources/fonts/ /app/fonts/

# Copy file JAR từ giai đoạn build
COPY --from=build /app/target/*.jar app.jar

# Chuyển quyền sở hữu cho user spring
RUN chown -R spring:spring /app

# Chuyển sang user không có quyền root
USER spring

# Expose port (Render sẽ tự động bind port)
EXPOSE 8080

# Health check (tùy chọn nhưng là thực hành tốt)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Tối ưu JVM cho môi trường container
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC -XX:+UseContainerSupport"

# Chạy ứng dụng
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]