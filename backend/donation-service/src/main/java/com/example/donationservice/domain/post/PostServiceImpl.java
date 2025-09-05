package com.example.donationservice.domain.post;

import com.example.donationservice.aws.s3.S3UploadService;
import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.category.Category;
import com.example.donationservice.domain.category.CategoryRepository;
import com.example.donationservice.domain.donation.DonationRepository;
import com.example.donationservice.domain.post.dto.PostDto;
import com.example.donationservice.domain.sponsor.Team;
import com.example.donationservice.domain.sponsor.TeamRepository;
import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.event.DeadlinePassedEventPublisher;
import lombok.RequiredArgsConstructor;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final TeamRepository teamRepository;
    private final CategoryRepository categoryRepository;
    private final S3UploadService s3UploadService;
    private final DonationRepository donationRepository;
    private final DeadlinePassedEventPublisher deadlinePassedEventPublisher;

    @Override
    @Transactional
    public void create(Long userId, PostDto.PostCreateRequest request) {
        // todo 전체 globalException 필요

        Team team = teamRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("팀를 찾을 수 없습니다."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
        try {
            //content script 공격에 대응하기 위한 살균 전략
            String sanitizedContent = sanitizeHtmlContent(request.getContent());
            // 3가지 이미지 버전으로 이미지를 업로드하는 메서드 호출 (processAndSavePostImages)
            S3UploadService.ProcessedContentResult result = s3UploadService.processAndSavePostImages(sanitizedContent, request.getImageFile());
            Post post = Post.builder()
                    .title(request.getTitle())
                    .content(result.getFinalContent())
                    .deadline(request.getDeadline())
                    .approvalStatus(ApprovalStatus.PENDING) // 기본 상태
                    .currentAmount(request.getCurrentAmount())// 필터링 테스트를 위한 임시용
                    .targetAmount(request.getTargetAmount())
                    .participants(request.getParticipants())// 필터링 테스트를 위한 임시용
                    .displayImageUrl(result.getRepresentativeImageUrl())
                    .thumnbnailImageUrl(result.getThumbnailUrl())
                    .team(team)
                    .category(category)
                    .goalReached(false)
                    .deadlinePassed(false)
                    .build();

            postRepository.save(post);
        } catch (IOException e) {
            throw new RestApiException(CommonErrorCode.FAIL_UPLOAD_IMAGE);
        }
    }

    @Override
    public PostDto.PostResponseWithTotalCount getposts(
            String sortBy,
            Long lastId,
            LocalDateTime lastCreatedAt,
            LocalDateTime lastEndDate,
            Long lastFundingAmount,
            Long lastParticipants,
            Long categoryId,
            int size,
            boolean initialLoad) {

        List<PostDto.PostResponse> resultList = postRepository.findPostsByCursor(
                sortBy,
                lastId,
                lastCreatedAt,
                lastEndDate,
                lastFundingAmount,
                lastParticipants,
                categoryId,
                size);

        //커서기반 추가 데이터 로딩이 아닌경우(처음 데이터 로딩)
        long totalCount = 0l;

        // 카테고리 텝 별로 첫 로딩시에 카운트 쿼리 생성
        // "전체" 카테고리(null)라면 post의 전체갯수를, 아니면 카테고리면 count해서 dto에 포함시킨다.
        if (initialLoad)
            totalCount = categoryId == null
                    ? postRepository.countByApprovalStatus(ApprovalStatus.ACCEPTED)
                    : postRepository.countByCategoryIdAndApprovalStatus(categoryId, ApprovalStatus.ACCEPTED);

        return PostDto.PostResponseWithTotalCount.builder()
                .totalCount(totalCount)
                .resultList(resultList)
                .build();
    }

    @Override
    @Transactional
    public PostDto.PostDetailResponse getPostDetilById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 게시글 상세 조회시 팀과 카테고리 정보도 함께 조회
        Team team = post.getTeam();
        Category category = post.getCategory();

        return PostDto.PostDetailResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .currentAmount(post.getCurrentAmount())
                .targetAmount(post.getTargetAmount())
                .deadline(post.getDeadline())
                .displayImageUrl(post.getDisplayImageUrl())
                .approvalStatus(post.getApprovalStatus())
                .teamId(team != null ? team.getId() : null)
                .teamName(team != null ? team.getName() : null)
                .categoryId(category != null ? category.getId() : null)
                .categoryName(category != null ? category.getName() : null)
                .likesCount(post.getLikesCount() != null ? post.getLikesCount() : 0)
                .participants(post.getParticipants())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostDto.PostMainResponse> getTop3CurrentAmountPosts() {
        // 현재 금액이 가장 높은 게시물 3개 조회
        List<Post> topPosts = postRepository.findTop3ByOrderByCurrentAmountDesc();

        return topPosts.stream()
                .map(post -> PostDto.PostMainResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .currentAmount(post.getCurrentAmount())
                        .targetAmount(post.getTargetAmount())
                        .deadline(post.getDeadline())
                        .imageUrl(post.getThumnbnailImageUrl())
                        .approvalStatus(post.getApprovalStatus())
                        .teamId(post.getTeam() != null ? post.getTeam().getId() : null)
                        .teamName(post.getTeam() != null ? post.getTeam().getName() : null)
                        .categoryId(post.getCategory() != null ? post.getCategory().getId() : null)
                        .categoryName(post.getCategory() != null ? post.getCategory().getName() : null)
                        .createdAt(post.getCreatedAt())
                        .updatedAt(post.getUpdatedAt())
                        .participants(post.getParticipants())
                        .likesCount(post.getLikesCount() != null ? post.getLikesCount() : 0)
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PostDto.PostMainResponse getPostWithEarliestEndDate() {
        // 마감일이 가장 빠른 게시물 조회
        Post post = postRepository.findFirstByDeadlineAfterOrderByDeadlineAsc(LocalDateTime.now())
                .orElseThrow(() -> new RestApiException(CommonErrorCode.POST_NOT_FOUND));

        Team team = post.getTeam();
        Category category = post.getCategory();

        return PostDto.PostMainResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .currentAmount(post.getCurrentAmount())
                .targetAmount(post.getTargetAmount())
                .deadline(post.getDeadline())
                .imageUrl(post.getThumnbnailImageUrl())
                .approvalStatus(post.getApprovalStatus())
                .teamId(team != null ? team.getId() : null)
                .teamName(team != null ? team.getName() : null)
                .categoryId(category != null ? category.getId() : null)
                .categoryName(category != null ? category.getName() : null)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .participants(post.getParticipants())
                .likesCount(post.getLikesCount() != null ? post.getLikesCount() : 0)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PostDto.PostMainResponse getTopDonationRatePost() {
        // 기부율이 가장 높은 게시물 조회
        Post topPost = postRepository.findTopPostByDonationRate();

        if (topPost == null) {
            throw new RestApiException(CommonErrorCode.POST_NOT_FOUND);
        }

        return PostDto.PostMainResponse.builder()
                .id(topPost.getId())
                .title(topPost.getTitle())
                .currentAmount(topPost.getCurrentAmount())
                .targetAmount(topPost.getTargetAmount())
                .deadline(topPost.getDeadline())
                .imageUrl(topPost.getThumnbnailImageUrl())
                .approvalStatus(topPost.getApprovalStatus())
                .teamId(topPost.getTeam() != null ? topPost.getTeam().getId() : null)
                .teamName(topPost.getTeam() != null ? topPost.getTeam().getName() : null)
                .categoryId(topPost.getCategory() != null ? topPost.getCategory().getId() : null)
                .categoryName(topPost.getCategory() != null ? topPost.getCategory().getName() : null)
                .createdAt(topPost.getCreatedAt())
                .updatedAt(topPost.getUpdatedAt())
                .participants(topPost.getParticipants())
                .likesCount(topPost.getLikesCount() != null ? topPost.getLikesCount() : 0)
                .build();
    }

    @Override
    @Transactional
    public void sendDeadlinePassedNotifications() {
        List<Post> expiredPosts = postRepository.findExpiredPostsDeadlinePassed(LocalDateTime.now());

        for(Post post : expiredPosts){
            // post의 deadlinePassed 필드를 true로 업데이트
            post.updateDeadlinePassed();

            List<User> donorUsers = donationRepository.findDistinctUsersByPost(post);
//            List<String> donorEmails = donationRepository.findDistinctUserEmailsByPostId(post.getId());

            List<String> donorEmails = donorUsers.stream()
                    .map(User::getEmail)
                    .toList();

            // 이메일 전송
            deadlinePassedEventPublisher.publishMailEvent(post, donorEmails);
            // 알람 저장
            deadlinePassedEventPublisher.publishAlarmEvent(post, donorUsers);
        }
    }

    /**
     * quill에디터를 통해 html이 string 값으로 들어온 content는 script 공격이 들어올 수 있다.
     * 백엔드단에서 살균을 통해 이를 방지한다.
     *
     * @param htmlContent
     * @return
     */
    public String sanitizeHtmlContent(String htmlContent) {
        if (htmlContent == null || htmlContent.trim().isEmpty()) {
            return "";
        }
        // 허용할 HTML 태그와 속성을 정의하는 정책 생성
        // Quill이 생성하는 일반적인 태그와 속성을 포함하되, script, iframe 등 위험 요소는 제외
        PolicyFactory policy = new HtmlPolicyBuilder()
                // 허용할 HTML 태그 정의
                .allowElements("a", "p", "div", "br", "strong", "em", "u", "s", "ol", "ul", "li",
                        "h1", "h2", "h3", "blockquote", "img", "pre", "code", // 기존 태그들
                        "span", "font") // Quill이 사용할 수 있는 추가 태그 (필요하다면)

                // 각 태그에 허용할 속성 정의
                .allowAttributes("href").onElements("a")
                .allowAttributes("src").onElements("img") // img 태그에 src 속성 허용
                .allowAttributes("alt", "title", "width", "height").onElements("img")
                .allowAttributes("class").onElements("p", "div", "strong", "em", "u", "s", "ol", "ul", "li",
                        "h1", "h2", "h3", "blockquote", "pre", "code", "span")
                .allowAttributes("style").onElements("p", "div", "span", "img") // 인라인 스타일을 허용할 경우 (필요 없으면 제거)
                .allowAttributes("target").onElements("a") // 링크 새 창 열기

                // ⭐ 이 부분이 핵심입니다: 허용할 URL 프로토콜 정의 ⭐
                .allowUrlProtocols("http", "https")
                // .allowUrlProtocols("http", "https", "data") // data:URI (Base64 인코딩 이미지)를 허용하려면 'data'도 추가

                .toFactory();

        return policy.sanitize(htmlContent);
    }
}
