#스테이지 1: 빌드 환경 설정 (Gradle과 Java 17 사용)
#이 스테이지는 애플리케이션 JAR 파일을 빌드하는 데 필요한 도구들을 포함합니다.
FROM gradle:8.14.2-jdk17-alpine AS builder

#컨테이너 내 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

#현재 디렉토리의 모든 파일(소스 코드, build.gradle 등)을 컨테이너의 /app 디렉토리로 복사합니다.
COPY . .

#Gradle을 사용하여 Spring Boot 애플리케이션을 빌드합니다.
#-x test 옵션은 빌드 시 테스트를 실행하지 않도록 하여 빌드 시간을 단축합니다.
#실제 운영 환경에서는 테스트 실행 여부를 프로젝트의 정책에 따라 결정해야 합니다.
RUN gradle bootJar -x test


#스테이지 2: 실행 환경 설정 (Java 17 JRE만 포함)
#이 스테이지는 빌드된 JAR 파일을 실행하는 데 필요한 최소한의 환경만 포함합니다.
#빌드 도구(Gradle)는 포함되지 않아 최종 이미지 크기가 작아집니다.
FROM openjdk:17


#컨테이너 내 작업 디렉토리를 /opt/springboot으로 설정합니다.
WORKDIR /opt/springboot

#'builder' 스테이지에서 빌드된 JAR 파일을 현재 스테이지로 복사합니다.
#JAR 파일의 경로는 프로젝트 설정에 따라 다를 수 있으므로, 실제 경로를 확인해야 합니다.
#일반적으로 build/libs/your-project-name-version.jar 형태입니다.
#여기서는 donation-service-1.0.jar를 예시로 사용했습니다.
#버전(예: 1.0)은 실제 빌드 결과물에 따라 수정해야 할 수 있습니다.
COPY --from=builder /app/build/libs/donation-service-0.0.1-SNAPSHOT.jar /opt/springboot/app.jar
#COPY --from=builder /app/build/libs/*.jar /opt/springboot/app.jar

#컨테이너가 시작될 때 Spring Boot 애플리케이션을 실행하는 명령어를 정의합니다.
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "app.jar"]