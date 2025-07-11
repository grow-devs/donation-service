package com.example.donationservice.domain.post;

import com.example.donationservice.domain.category.Category;
import com.example.donationservice.domain.category.CategoryRepository;
import com.example.donationservice.domain.post.dto.PostDto;
import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public void create(Long userId, PostDto.PostCreateRequest request) {
        // todo 전체 globalException 필요
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .deadline(request.getDeadline())
                .approvalStatus(ApprovalStatus.PENDING) // 기본 상태
                .currentAmount(0L)
                .targetAmount(request.getTargetAmount())
                .imageUrl(request.getImageUrl())
                .team(user.getTeam())
                .category(category)
                .build();

        postRepository.save(post);
    }

    @Override
    @Transactional()
    public Slice<PostDto.PostResponse> getPosts(Pageable pageable) {
        // repository 에서 페이징 조회
        Slice<Post> posts = postRepository.findAll(pageable);

        // Post -> PostResponse DTO 변환
        return posts.map(post -> PostDto.PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .currentAmount(post.getCurrentAmount())
                .targetAmount(post.getTargetAmount())
                .deadline(post.getDeadline())
                .imageUrl(post.getImageUrl())
                .approvalStatus(post.getApprovalStatus())
                .teamId(post.getTeam().getId())
                .categoryId(post.getCategory().getId())
                .build()
        );
    }

}
