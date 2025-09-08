# 기부플랫폼 서비스 :마음이음
<div align="center">
<img width="350" height="200" alt="Image" src="https://github.com/user-attachments/assets/3e9f2c52-42f6-4046-8444-d09ac12a2595" />
</div>
&nbsp;

## **개요**😀

사용자가 후원 단체와 기부 게시물을 생성하고 참여할 수 있는 기부 플랫폼으로, 실시간 랭킹, 알림, 메일 전송 기능이 있는 서비스입니다. 
Spring Boot와 React 기반으로 개발되었으며 AWS 인프라 (EC2, S3, CloudFront, ALB, ASG)와 CI/CD 파이프라인을 적용해 안정성과 확장성을 고려한 서비스 아키텍처를 구현했습니다.

&nbsp;

## **시연 영상** 🖥️

클릭 하시면 유튜브 시연 영상 페이지로 이동합니다.

[![Video Thumbnail](https://img.youtube.com/vi/1GLJzIBFZ2Q/0.jpg)](https://www.youtube.com/watch?v=1GLJzIBFZ2Q)

&nbsp;

## **개발 기간 및 인원📅**

기간 : 2025.06.25 ~ 2025.09.04 (10주)

팀원 : 2명 (backend,frontend 공동 개발)


&nbsp;



## **개발 환경** 🛠


**Back-end**

- Java (17), SpringBoot (3.3.13), Gradle (8.14.2), QueryDSL (5.0.0), spring data jpa, springSecurity, postgres, redis

**Front-end**

- React (18.3.1), Vite (6.2.0), Styled Components (6.1.19), Material UI (7.1.2)

**CI-CD**

- Docker, github, Jenkins, ECR (Elastic Container Registry)

**Server Infra**

- AWS EC2(auto scaling group), ALB(Application Load Balancer), CloudFront, RDS(PostgreSQL), Elasticache(Redis)

**Frontend Hosting**

- S3, Cloudfront


&nbsp;



## **주요 개발📌**


- 데이터베이스 레벨에서 LockModeType를 사용해 **비관적 락**을 통해 기부금 **동시성을 제어 문제를 해결**함
- **Refresh Token**을 Redis에 저장하고 클라이언트에는 HttpOnly 쿠키로 전달하여 토큰 탈취 위험을 최소화하면서도 빠른 검증 및 **다중 서버 환경에서의 확장성을 확보**함.
- 조회 트래픽이 높은 비중을 차지하는 상황에서 다중 조건 검색과 커서 기반 페이징 최적화를 위해 **복합 인덱스**를 설계 및 적용했으며 그 결과 **조회 성능을 약 60% 개선**하고 **RDS CPU 부하를 완화**하여 서비스 안정성과 확장성을 확보함.
- Jenkins CI/CD 파이프라인을 구축해 서비스를 Docker 기반으로 자동 빌드,배포. 
  프론트엔드는 S3+CloudFront 캐시 무효화, 백엔드는 ECR과 ASG 롤링 배포로 이중화 및 무중단 배포.
- 다수 사용자에게 이메일을 전송해야 하는 상황에서 서버 자원을 효율적으로 활용하기 위해 **Spring Event + @Async + TaskExecutor** 기반 **비동기 멀티스레딩**을 구현했다. 이를 통해 I/O 바운드 작업을 병렬 처리하며 메인 애플리케이션 성능 저하 없이 안정적으로 이메일과 알람을 발송할 수 있음.
- **ElastiCache(Redis) ZSet**을 사용해 점수 기반 자동 정렬로 실시간 랭킹을 제공하도록 개선함. ElastiCache를 활용해 분산 환경에서 안정성과 확장성을 확보하며 데이터 정합성을 유지함.


&nbsp;



## **시스템 아키텍처**⚙️

<div align="center">

<img width="550" height="550" alt="Image" src="https://github.com/user-attachments/assets/a21c9b39-e0dd-4ec8-95dc-cd94c0cc02a5" /> 
</div>

&nbsp;

### **요청 흐름 🔄**

사용자의 요청이 시스템에서 어떻게 처리되는지 그 과정을 단계별로 설명합니다.

1. **사용자 요청**: 사용자의 웹 브라우저에서 서비스에 접속합니다.
2. **CDN 캐시 확인**: **CloudFront**가 요청을 받아 캐시에 해당 콘텐츠가 있는지 확인합니다.
3. **정적 콘텐츠 응답**: **CloudFront**에 콘텐츠(HTML, CSS, JS 등)가 캐싱되어 있다면, **S3**로부터 파일을 가져오지 않고 즉시 사용자에게 전달하여 빠른 응답을 제공합니다.
4. **API 호출**: 동적 데이터가 필요한 API 요청은 **CloudFront**를 거쳐 **ALB**로 전달됩니다.
5. **트래픽 분산**: **ALB**는 요청을 **ASG**에 의해 관리되는 여러 **EC2 인스턴스** 중 하나로 분산시킵니다.
6. **DB 연동**: **EC2** 인스턴스의 백엔드 애플리케이션은 **Elasticache, RDS, S3** 에서 데이터를 조회하거나 저장합니다.
7. **최종 응답**: 백엔드 애플리케이션은 처리 결과를 **ALB**를 거쳐 다시 **CloudFront**를 통해 사용자에게 반환합니다.


&nbsp;


### **배포 프로세스(CI/CD)💡**

**CI/CD**

- 단일 ec2에 dokcer를 띄워 jenkins 이미지를 사용하여 jenkins 파이프라인을 통해 빌드 및 배포 자동화. IAM Role을 통해 AWS 서비스에 접근해서 필요한 권한 획득.
- java,gradle,aws cli등 빌드에 필요한 스택을 docker run --rm을 통해 컨테이너에 잠시 올려 사용.

**프론트엔드 배포**

- 프론트엔드(react) 빌드 결과물은 S3 버킷에 저장되고, CloudFront를 통해 사용자에게 제공.

**백엔드 배포**

1. 백엔드의 빌드 결과물은 ECR에 docker image로 저장.
2. jenkins의 파이프라인을 통해 새로운 시작 탬플릿 버전 생성.
3. ASG를 업데이트하여 방금 생성한 가장 최신 시작 템플릿 버전을 사용하도록 지정.
4. 자동화된 롤링 업데이트 진행. 이때 asg는 인스턴스를 리프레시하고 최신 시작 탬플릿의 UserData 스크립트를 실행하는 새로운 인스턴스를 띄운다. 이 스크립트는 ECR에서 최신 Docker 이미지를 pull하고 실행.


&nbsp;



## **주요 기능📌**

- 회원가입 / 로그인
- 단체 신청
  - 후원단체(팀)를 생성해야 기부를 모금하는 게시물을 만들 수 있다.
- 마이페이지 조회
  - 내가 기부한 게시물 내역을 조회한다.
  - 내가 좋아요한 관심 게시물 목록을 조회한다.
  - 내가 작성한 게시물 목록을 조회한다.
- 랭킹 조회
  - 오늘의 기부 랭킹
  - 최근 30일 랭킹
  - 명예의 전당 (누적 랭킹)
- 메인 페이지 게시물 조회
  - 가장 많은 기부금이 모인 상위 3개의 게시물을 조회한다.
  - 데드라인이 가장 남지 않은 게시물을 조회한다.
  - 목표 퍼센트가 가장 높은 게시물 1개를 조회한다.
- 전체 게시물 조회
  - 어드민 계정이 수락한 게시물만 조회한다.
  - 카테고리 별로 게시물을 조회한다.
- 게시물 생성
  - s3를 활용하여 이미지 업로드
- 댓글 생성
  - 댓글 작성시 100원 기부
- 게시물 기부
  - 사용자의 포인트를 사용해서 게시물에 기부를 할 수 있다.
- 좋아요
  - 게시글을 좋아요 시 취소 불가능하고 100원 기부
  - 댓글에 좋아요 가능(취소 가능)
- 알람
  - 게시물이 관리자에 의해 승인 됐을 때 알람을 발생시킨다.
  - 후원단체(팀)가 관리자에 의해 승인 됐을 때 알람을 발생시킨다.
  - 게시물이 기부 목표금액에 도달했을 경우 게시물에 기부한 사람들에게 알람을 발생시킨다.
  - 게시물이 마감일(데드라인)에 도달했을 경우 게시물에 기부한 사람들에게 알람을 발생시킨다.
- 메일 전송
  - 게시물이 기부 목표금액에 도달했을 경우와 마감일에 도달 했을 경우에 게시물에 기부한 사람들에게 메일을 전송한다.


&nbsp;



<details>
<summary>AWS 배포 대시보드 보기 🖥️</summary>
    <h3>
        오토 스케일링 그룹 
    </h3>
<p>
<img width="556" height="175" alt="Image" src="https://github.com/user-attachments/assets/a41683e2-6514-44b9-bd63-4f0f3e227e58" />
</p>
 <p>
<img width="1174" height="524" alt="Image" src="https://github.com/user-attachments/assets/a45a2e5d-c28a-4b5d-9422-de47dfb905dc" />
</p>
    <br/>
     <h3>
        RDS
    </h3>
<p>
<img width="1105" height="715" alt="Image" src="https://github.com/user-attachments/assets/9643420e-f7f1-4c84-a341-ca7e945edf0e" />
</p><br/>
    <h3>
        Elasticache
    </h3>
<p>
<img width="1464" height="608" alt="Image" src="https://github.com/user-attachments/assets/0c1cce59-62cc-4b02-a34c-a9da0687c5b1" />
</p><br/>
    <h3>
        CloudFront
    </h3>
<p>
<img width="1600" height="690" alt="Image" src="https://github.com/user-attachments/assets/7097e67e-1a49-4ece-b3fd-d665c04cb45d" />
</p><br/>
    <h3>
        S3
    </h3>
<p>
<img width="985" height="211" alt="Image" src="https://github.com/user-attachments/assets/710942ce-9aaf-4c95-831b-337d551e71e8" />
</p>
 <p>
<img width="564" height="337" alt="Image" src="https://github.com/user-attachments/assets/1868d6d9-fc4f-4cf8-8059-03c77e3ed32c" />
</p>
<p>
<img width="996" height="589" alt="Image" src="https://github.com/user-attachments/assets/beed96c8-c860-449b-aa00-57d31944636b" />
</p>
  <p>
<img width="914" height="397" alt="Image" src="https://github.com/user-attachments/assets/cc1b79e5-c239-4bb8-900e-87732aa76ddf" />
</p>
    <p>
<img width="914" height="397" alt="Image" src="https://github.com/user-attachments/assets/cc1b79e5-c239-4bb8-900e-87732aa76ddf" />
</p>
</details>

