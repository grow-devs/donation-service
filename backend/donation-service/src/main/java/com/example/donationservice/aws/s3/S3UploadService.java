package com.example.donationservice.aws.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URL;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3UploadService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    /**
     * 파일을 S3에 업로드하고 업로드된 파일의 URL을 반환합니다.
     * @param multipartFile 업로드할 MultipartFile 객체
     * @param directory S3 버킷 내에 저장될 디렉토리 경로 (예: "post-images/", "profile-pictures/")
     * @return 업로드된 파일의 S3 URL
     * @throws IOException 파일 처리 중 발생할 수 있는 예외
     */
    public String uploadFile(MultipartFile multipartFile, String directory) throws IOException {
        // 파일 고유명 생성 (UUID + 원본 확장자)
        String originalFilename = multipartFile.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = directory + UUID.randomUUID().toString() + fileExtension; // 예: "post-images/a1b2c3d4-e5f6-7890-1234-56789abcdef0.png"

        // S3에 업로드 요청 객체 생성
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName) // S3에 저장될 파일 경로 및 이름
                .contentType(multipartFile.getContentType()) // 파일 타입 설정 (옵션, but 권장)
                .contentLength(multipartFile.getSize()) // 파일 크기 설정 (옵션, but 권장)
                .build();

        // 파일 업로드 실행
        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(multipartFile.getInputStream(), multipartFile.getSize()));

        // 업로드된 파일의 URL 가져오기
        URL url = s3Client.utilities().getUrl(GetUrlRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build());

        return url.toExternalForm(); // S3 URL 반환
    }

    /**
     * S3에서 파일을 삭제합니다.
     * @param fileUrl 삭제할 파일의 S3 URL (예: "https://your-bucket.s3.amazonaws.com/post-images/image.png")
     */
    public void deleteFile(String fileUrl) {
        String key = getKeyFromUrl(fileUrl); // URL에서 S3 키(파일 경로) 추출
        if (key != null) {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        }
    }

    /**
     * S3 URL에서 객체 키 (파일 경로)를 추출하는 헬퍼 메서드
     */
    private String getKeyFromUrl(String fileUrl) {
        // S3 URL 형식: https://<bucket-name>.s3.<region>.amazonaws.com/<key>
        // 또는 Custom Domain 사용 시: https://<custom-domain>/<key>
        try {
            URL url = new URL(fileUrl);
            String path = url.getPath();
            // 경로의 첫 '/'(슬래시)를 제거하여 실제 키를 얻음
            return path.startsWith("/") ? path.substring(1) : path;
        } catch (Exception e) {
            System.err.println("Failed to parse S3 URL: " + fileUrl + " - " + e.getMessage());
            return null;
        }
    }
}