# 1. Build Stage (프로젝트에 포함된 Wrapper 사용)
FROM gradle:jdk17-alpine As builder
WORKDIR /build
COPY . .
RUN ./gradlew bootJar

# 2. Run Stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# 3. 타임존 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 4. 빌드된 JAR 복사
COPY --from=builder /build/build/libs/*.jar app.jar

# 5. 컨테이너 포트 공개
EXPOSE 8080

# 6. 실행 명령어
ENTRYPOINT ["java", "-jar", "-Duser.timezone=Asia/Seoul", "/app/app.jar"]