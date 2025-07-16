package com.example.donationservice.domain.post;

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

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final TeamRepository teamRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public void create(Long userId, PostDto.PostCreateRequest request) {
        // todo 전체 globalException 필요

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(()-> new IllegalArgumentException("팀를 찾을 수 없습니다."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .deadline(request.getDeadline())
                .approvalStatus(ApprovalStatus.PENDING) // 기본 상태
                .currentAmount(request.getCurrentAmount())// 필터링 테스트를 위한 임시용
                .targetAmount(request.getTargetAmount())
                .participants(request.getParticipants())// 필터링 테스트를 위한 임시용
                .imageUrl(request.getImageUrl())
                .team(team)
                .category(category)
                .build();

        postRepository.save(post);
    }

    @Override
    public List<PostDto.PostResponse> getposts(
            String sortBy,
            Long lastId,
            LocalDateTime lastCreatedAt,
            LocalDateTime lastEndDate,
            Long lastFundingAmount,
            Long lastParticipants,
            Long categoryId,
            int size) {
        return postRepository.findPostsByCursor(
                sortBy,
                lastId,
                lastCreatedAt,
                lastEndDate,
                lastFundingAmount,
                lastParticipants,
                categoryId,
                size
        );
    }

}
