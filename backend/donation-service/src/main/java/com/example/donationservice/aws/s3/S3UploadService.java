//package com.example.donationservice.aws.s3;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.web.multipart.MultipartFile;
//import software.amazon.awssdk.core.sync.RequestBody;
//import software.amazon.awssdk.services.s3.S3Client;
//import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
//import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
//import software.amazon.awssdk.services.s3.model.GetUrlRequest;
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;
//
//import java.io.IOException;
//import java.net.URL;
//import java.util.UUID;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//
//@Service
//@RequiredArgsConstructor
//public class S3UploadService {
//
//    private final S3Client s3Client;
//
//    @Value("${aws.s3.bucket}")
//    private String bucketName;
//
//    @Value("${aws.s3.region}")
//    private String region;
//
//    private static final String TEMP_UPLOAD_DIR="temp/";
//    private static final String POST_IMAGES_DIR="post-images/";
//
//    /**
//     * 파일을 S3에 업로드하고 업로드된 파일의 URL을 반환합니다.
//     * @param multipartFile 업로드할 MultipartFile 객체
//     * @param directory S3 버킷 내에 저장될 디렉토리 경로 (예: "post-images/", "profile-pictures/")
//     * @return 업로드된 파일의 S3 URL
//     * @throws IOException 파일 처리 중 발생할 수 있는 예외
//     */
//    public String uploadFile(MultipartFile multipartFile, String directory) throws IOException {
//        // 파일 고유명 생성 (UUID + 원본 확장자)
//        String originalFilename = multipartFile.getOriginalFilename();
//        String fileExtension = "";
//        if (originalFilename != null && originalFilename.contains(".")) {
//            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
//        }
//        String fileName = directory + UUID.randomUUID().toString() + fileExtension; // 예: "post-images/a1b2c3d4-e5f6-7890-1234-56789abcdef0.png"
//        // S3에 업로드 요청 객체 생성
//        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
//                .bucket(bucketName)
//                .key(fileName) // S3에 저장될 파일 경로 및 이름
//                .contentType(multipartFile.getContentType()) // 파일 타입 설정 (옵션, but 권장)
//                .contentLength(multipartFile.getSize()) // 파일 크기 설정 (옵션, but 권장)
//                .build();
//
//        // 파일 업로드 실행
//        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(multipartFile.getInputStream(), multipartFile.getSize()));
//
//        // 업로드된 파일의 URL 가져오기
//        URL url = s3Client.utilities().getUrl(GetUrlRequest.builder()
//                .bucket(bucketName)
//                .key(fileName)
//                .build());
//
//        return url.toExternalForm(); // S3 URL 반환
//    }
//
//    /**
//     * 게시물 HTML 내용에서 임시 이미지 URL을 찾아 영구 URL로 교체하고 S3에서 이동시키는 메서드
//     * @param content
//     * @return
//     * @throws IOException
//     */
//    public String copyFile(String content) throws IOException {
//        // 정규식을 사용하여 <img> 태그의 src 속성에서 임시 S3 URL을 찾습니다.
//        // 예시 URL: https://your-bucket.s3.region.amazonaws.com/temp-uploads/uuid.jpg
//        Pattern pattern = Pattern.compile("https://[a-zA-Z0-9.-]+\\.s3\\.[a-zA-Z0-9.-]+\\.amazonaws\\.com/temp/([a-zA-Z0-9-]+\\.[a-zA-Z0-9]+)");
//        Matcher matcher = pattern.matcher(content);
//
//        // 변경된 내용을 저장할 StringBuilder
//        StringBuilder newContentBuilder = new StringBuilder();
//        int lastIndex = 0; // 이전에 매치된 문자열의 끝 인덱스
//
//        while (matcher.find()) {
//            String fullTempUrl = matcher.group(0); // 매치된 전체 string ( 전체 임시 s3 url )
//            String uuidFileName = matcher.group(1); // pattern에서 ( )로 감싸져있는 부분이 첫번째 캡처 그룹. UUID와 확장자 (예: uuid.jpg)
//            System.out.println("fullTempUrl : " + fullTempUrl+ " , "+"uuidFileName : " + uuidFileName);
//            // 1. S3에서 이미지 이동 (Copy Object + Delete Object)
//            String sourceKey = TEMP_UPLOAD_DIR + uuidFileName; // temp/uuid.jpg
//            String destinationKey = POST_IMAGES_DIR  + uuidFileName; // post-images/uuid.jpg
//
//            // 복사 요청
//            CopyObjectRequest copyObjRequest = CopyObjectRequest.builder()
//                    .sourceBucket(bucketName)
//                    .sourceKey(sourceKey)
//                    .destinationBucket(bucketName)
//                    .destinationKey(destinationKey)
////                    .acl(ObjectCannedACL.PUBLIC_READ) // 필요하다면 ACL 유지
//                    .build();
//            s3Client.copyObject(copyObjRequest);
//
//            // 2. HTML 내용에서 URL 교체
//            String newPermanentUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + destinationKey;
//            System.out.println("newPermanentUrl : " + newPermanentUrl);
//
//            // StringBuilder에 이전 내용 추가
//            newContentBuilder.append(content.substring(lastIndex, matcher.start()));
//            // 새 영구 URL 추가
//            newContentBuilder.append(newPermanentUrl);
//            lastIndex = matcher.end(); // 마지막 인덱스 업데이트
//        }
//
//        // 마지막 매치 이후 남은 내용 추가
//        newContentBuilder.append(content.substring(lastIndex));
//
//        return newContentBuilder.toString();
//    }
//
//}
package com.example.donationservice.aws.s3;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import net.coobird.thumbnailator.Thumbnails;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class S3UploadService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    // S3 폴더명 상수 정의
    private static final String TEMP_UPLOAD_DIR = "temp/";              // Quill 에디터 임시 업로드용 (S3 Lifecycle으로 자동 삭제)
    private static final String POST_ORIGINALS_DIR = "posts/originals/"; // 게시물 원본 이미지 저장 폴더 (게시물 ID 포함)
    private static final String POST_DISPLAY_DIR = "posts/display/";     // 게시물 본문 및 상세 조회 대표 이미지용
    private static final String POST_THUMBS_DIR = "posts/thumbs/";       // 게시물 목록 썸네일용
    private static final String USER_PROFILE_DIR = "users/profile/"; // 사용자 프로필 이미지 저장 폴더

    // 이미지 리사이징 크기 설정 (픽셀)
    private static final int DISPLAY_IMAGE_MAX_WIDTH = 1000; // 게시물 본문 및 대표 이미지의 최대 너비
    private static final int THUMBNAIL_W_SIZE = 270;           // 썸네일 이미지의 가로세로 크기 (정사각형으로 자름)
    private static final int THUMBNAIL_H_SIZE = 192;           // 썸네일 이미지의 가로세로 크기 (정사각형으로 자름)

    /**
     * 범용 S3 파일 업로드 메서드 (내부 사용)
     * @param inputStream 업로드할 파일의 InputStream
     * @param key S3에 저장될 객체 키 (경로/파일이름)
     * @param contentType 파일의 MIME 타입
     * @param contentLength 파일의 크기 (바이트)
     * @return 업로드된 파일의 S3 URL
     * @throws IOException
     */
    private String uploadFileToS3(InputStream inputStream, String key, String contentType, long contentLength) throws IOException {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .contentLength(contentLength)
//                .acl(ObjectCannedACL.PUBLIC_READ) // 개발 편의성을 위한 PUBLIC_READ. 운영 환경에서는 IAM/CloudFront 정책 권장
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, contentLength));
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
    }

    /**
     * Quill 에디터에서 임시 이미지를 S3 temp/ 폴더에 업로드합니다.
     * 이 메서드는 오직 임시 업로드에만 사용됩니다.
     * @param file MultipartFile 형태의 이미지 파일
     * @return 임시 S3 URL
     * @throws IOException
     */
    public String uploadTempImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String key = TEMP_UPLOAD_DIR + UUID.randomUUID().toString() + "." + fileExtension;

        return uploadFileToS3(file.getInputStream(), key, file.getContentType(), file.getSize());
    }

    public String uploadProfileImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String key = USER_PROFILE_DIR + UUID.randomUUID().toString() + "." + fileExtension;

        return uploadFileToS3(file.getInputStream(), key, file.getContentType(), file.getSize());
    }

    /**
     * 게시물 HTML 내용에서 임시 S3 이미지 URL을 찾아 영구 URL로 교체하고,
     * S3 내에서 이미지 버전 (원본, 디스플레이, 썸네일)을 생성 및 업로드합니다.
     *
     * @param content Quill 에디터의 HTML 내용
     * @param representativeImageFile 게시물 대표 이미지로 별도 업로드된 파일 (선택 사항)
     * @return 처리된 HTML 내용과 게시물의 최종 대표 이미지 URL을 포함하는 ProcessedContentResult 객체
     * @throws IOException
     */
    public ProcessedContentResult processAndSavePostImages(String content,MultipartFile representativeImageFile) throws IOException {
        String finalContent = content;
        String representativeImageUrl = null;
        String thumbnailUrl = null;

        // 1. 별도로 업로드된 대표 이미지가 있다면 먼저 처리
        if (representativeImageFile != null && !representativeImageFile.isEmpty()) {
            String fileExtension = getFileExtension(representativeImageFile.getOriginalFilename());
            String uuidFileName = UUID.randomUUID().toString() + "." + fileExtension;

            // 대표 이미지를 원본, 디스플레이, 썸네일로 처리하여 S3에 업로드
            ImageUploadResult result = UploadImageVersions(
                    representativeImageFile.getInputStream(),
                    uuidFileName,
                    fileExtension
            );
            //썸네일 이미지 url도 포함
            thumbnailUrl = result.getThumbnailUrl();
            representativeImageUrl = result.getDisplayImageUrl(); // 대표 이미지는 디스플레이 버전으로 설정
        }

        // 2. HTML content 내의 임시 이미지 처리
        // 정규식: temp/ 폴더의 이미지 URL을 찾기 (S3 경로 동적 생성)
        String regex = String.format("https://%s\\.s3\\.%s\\.amazonaws\\.com/%s([a-zA-Z0-9-]+\\.[a-zA-Z0-9]+)",
                Pattern.quote(bucketName), Pattern.quote(region), Pattern.quote(TEMP_UPLOAD_DIR));
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(content);

        StringBuilder newContentBuilder = new StringBuilder();
        int lastIndex = 0; // HTML 문자열 처리용 인덱스

        while (matcher.find()) {
            String fullTempUrl = matcher.group(0); // 매치된 전체 임시 URL
            String uuidFileName = matcher.group(1); // UUID + 확장자 (예: uuid.jpg)
            String fileExtension = getFileExtension(uuidFileName); // 파일 확장자 추출

            String tempKey = TEMP_UPLOAD_DIR + uuidFileName; // 임시 S3 경로

            // 2-1. 임시 S3에서 원본 이미지 다운로드
            byte[] originalImageBytes;
            try (ResponseInputStream<?> s3Object = s3Client.getObject(GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(tempKey)
                    .build())) {
                originalImageBytes = s3Object.readAllBytes();
            } catch (Exception e) {
                System.err.println("임시 이미지 다운로드 실패 : " + tempKey + ": " + e.getMessage());
                // 이미지 다운로드 실패 시 해당 이미지는 건너뛰고 기존 URL 유지
                newContentBuilder.append(content.substring(lastIndex, matcher.end()));
                lastIndex = matcher.end();
                continue; // 다음 이미지로 넘어감
            }

            // 2-2. 이미지 버전 (원본, 디스플레이, 썸네일) 생성 및 S3에 업로드
            ImageUploadResult result = UploadImageVersions(
                    new ByteArrayInputStream(originalImageBytes),
                    uuidFileName,
                    fileExtension
            );

            // 첫 번째 이미지의 디스플레이 URL을 게시물 대표 이미지로 설정 (별도 대표 이미지가 없는 경우)
            if (representativeImageUrl == null) {
                representativeImageUrl = result.getDisplayImageUrl();
            }
            // 첫 번째 이미지의 썸네일 URL을 게시물 대표 이미지로 설정 (별도 대표 이미지가 없는 경우)
            if (thumbnailUrl == null) {
                thumbnailUrl = result.getThumbnailUrl();
            }


            // 2-3. HTML 내용에서 임시 URL을 디스플레이용 영구 URL로 교체
            newContentBuilder.append(content.substring(lastIndex, matcher.start()));
            newContentBuilder.append(result.getDisplayImageUrl()); // 디스플레이용 이미지 URL로 교체
            lastIndex = matcher.end();
        }

        // 마지막 매치 이후 남은 HTML 내용 추가
        newContentBuilder.append(content.substring(lastIndex));
        finalContent = newContentBuilder.toString();

        // temp/ 폴더의 원본 파일 삭제는 S3 수명 주기 규칙에 맡깁니다.
        return new ProcessedContentResult(finalContent, representativeImageUrl,thumbnailUrl);
    }

    /**
     * 원본 이미지 스트림으로부터 여러 버전의 이미지를 생성하고 S3에 업로드
     *
     * @param originalInputStream 원본 이미지 InputStream
     * @param uuidFileName 원본 파일명 (UUID.확장자)
     * @param fileExtension 파일 확장자
     * @return 업로드된 이미지들의 URL을 담은 ImageUploadResult 객체
     * @throws IOException
     */
    private ImageUploadResult UploadImageVersions(
            InputStream originalInputStream,
            String uuidFileName,
            String fileExtension) throws IOException {

        // InputStream을 여러 번 사용하기 위해 byte[]로 읽어둠
        ByteArrayOutputStream originalBytesBuffer = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = originalInputStream.read(buffer)) != -1) {
            originalBytesBuffer.write(buffer, 0, bytesRead);
        }
        byte[] originalBytes = originalBytesBuffer.toByteArray();

        // 1. 원본 이미지 S3에 업로드
        String originalKey = POST_ORIGINALS_DIR + uuidFileName;
        String originalUrl = uploadFileToS3(new ByteArrayInputStream(originalBytes), originalKey, "image/" + fileExtension, originalBytes.length);
        System.out.println("원본 이미지 업로드 : " + originalUrl);

        // 2. 게시물 본문/대표 이미지용 (디스플레이용) 이미지 생성 및 업로드
        ByteArrayOutputStream displayOutputStream = new ByteArrayOutputStream();
        Thumbnails.of(new ByteArrayInputStream(originalBytes))
                .width(DISPLAY_IMAGE_MAX_WIDTH) // 최대 너비 설정 (높이는 비율 유지)
                .outputFormat(fileExtension)
                .outputQuality(0.9)
                .toOutputStream(displayOutputStream);

        byte[] displayBytes = displayOutputStream.toByteArray();
        String displayKey = POST_DISPLAY_DIR+ uuidFileName;
        String displayUrl = uploadFileToS3(new ByteArrayInputStream(displayBytes), displayKey, "image/" + fileExtension, displayBytes.length);
        System.out.println("디스플레이용 이미지 업로드 : " + displayUrl);

        // 3. 썸네일 이미지 생성 및 업로드
        ByteArrayOutputStream thumbOutputStream = new ByteArrayOutputStream();
        Thumbnails.of(new ByteArrayInputStream(originalBytes))
                .size(THUMBNAIL_W_SIZE, THUMBNAIL_H_SIZE) // <--- 고정된 가로세로 크기 지정
                .crop(Positions.CENTER) // <--- 중앙 기준으로 크롭
                .outputQuality(0.9)
                .outputFormat(fileExtension)
                .toOutputStream(thumbOutputStream);

        byte[] thumbBytes = thumbOutputStream.toByteArray();
        String thumbKey = POST_THUMBS_DIR + uuidFileName;
        String thumbnailUrl = uploadFileToS3(new ByteArrayInputStream(thumbBytes), thumbKey, "image/" + fileExtension, thumbBytes.length);
        System.out.println("썸네일용 이미지 업로드 : " + thumbnailUrl);

        return new ImageUploadResult(originalUrl, displayUrl, thumbnailUrl);
    }

    /**
     * S3 URL에서 객체 키 (파일 경로)를 추출하는 헬퍼 메서드
     */
    public String getKeyFromUrl(String fileUrl) {
        try {
            URL url = new URL(fileUrl);
            String path = url.getPath();
            return path.startsWith("/") ? path.substring(1) : path;
        } catch (Exception e) {
            System.err.println("Failed to parse S3 URL: " + fileUrl + " - " + e.getMessage());
            return null;
        }
    }

    /**
     * S3에서 파일을 삭제합니다. (S3 Lifecycle 정책을 사용한다면 이 메서드는 직접 호출될 일이 거의 없음)
     * @param fileUrl 삭제할 파일의 S3 URL
     */
    public void deleteFile(String fileUrl) {
        String key = getKeyFromUrl(fileUrl);
        if (key != null) {
            s3Client.deleteObject(software.amazon.awssdk.services.s3.model.DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build());
            System.out.println("Deleted S3 object: " + key);
        }
    }

    /**
     * 파일 확장자를 추출하는 헬퍼 메서드
     */
    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
            return fileName.substring(dotIndex + 1).toLowerCase();
        }
        return "png"; // 기본값 또는 예외 처리
    }

    // 업로드된 이미지들의 URL을 담기 위한 내부 클래스
    @Getter
    @AllArgsConstructor
    private static class ImageUploadResult {
        private String originalImageUrl;
        private String displayImageUrl;
        private String thumbnailUrl;
    }

    // 게시물 저장 후 반환될 결과 (처리된 HTML 내용과 대표 이미지 URL)
    @Getter
    @AllArgsConstructor
    public static class ProcessedContentResult {
        private String finalContent;
        private String representativeImageUrl;
        private String thumbnailUrl;
    }
}