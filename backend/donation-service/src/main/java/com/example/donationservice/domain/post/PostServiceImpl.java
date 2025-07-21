package com.example.donationservice.domain.post;

import com.example.donationservice.aws.s3.S3UploadService;
import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.category.Category;
import com.example.donationservice.domain.category.CategoryRepository;
import com.example.donationservice.domain.post.dto.PostDto;
import com.example.donationservice.domain.sponsor.Team;
import com.example.donationservice.domain.sponsor.TeamRepository;
import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final TeamRepository teamRepository;
    private final CategoryRepository categoryRepository;
    private final S3UploadService s3UploadService;

    @Override
    @Transactional
    public void create(Long userId, PostDto.PostCreateRequest request) {
        // todo 전체 globalException 필요

        Team team = teamRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("팀를 찾을 수 없습니다."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
        try {
            // 3가지 이미지 버전으로 이미지를 업로드하는 메서드 호출 (processAndSavePostImages)
            S3UploadService.ProcessedContentResult result= s3UploadService.processAndSavePostImages(request.getContent(),request.getImageFile());
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
                    .build();

            postRepository.save(post);
        }catch (IOException e){
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
                    ? postRepository.count()
                    : postRepository.countByCategoryId(categoryId);

        return PostDto.PostResponseWithTotalCount.builder()
                .totalCount(totalCount)
                .resultList(resultList)
                .build();

    }

}
