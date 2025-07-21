package com.example.donationservice.aws.s3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
@Configuration
public class S3Config {

    @Value("${aws.s3.region}") // application.yml에서 'aws.s3.region' 값을 주입받음
    private String region;

    @Bean // Spring 컨테이너에 S3Client 객체를 빈으로 등록
    public S3Client s3Client() {
        // AWS SDK v2 방식
        return S3Client.builder()
                .region(Region.of(region)) // application.yml에서 주입받은 리전 사용
                // .credentialsProvider(...) <--- 이 코드를 넣지 않는 것이 핵심!
                .build();

        // 만약 AWS SDK v1을 사용한다면 이렇게 설정합니다:
        // return AmazonS3ClientBuilder.standard()
        //         .withRegion(region) // application.yml에서 주입받은 리전 사용
        //         // .withCredentials(DefaultAWSCredentialsProviderChain.getInstance()) <-- 이 코드를 명시적으로 넣지 않아도 됨
        //         .build();
    }
}