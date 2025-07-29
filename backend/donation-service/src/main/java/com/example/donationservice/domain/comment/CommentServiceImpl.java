package com.example.donationservice.domain.comment;

import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.comment.dto.CommentDto;
import com.example.donationservice.domain.like.CommentLikeRepository;
import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.post.PostRepository;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.example.donationservice.common.exception.CommonErrorCode.POST_NOT_FOUND;
import static com.example.donationservice.common.exception.CommonErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;

    @Override
    @Transactional
    public void createComment(Long userId, CommentDto.CreateCommentRequest request) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(USER_NOT_FOUND));

        Post post = postRepository.findByIdWithLock(request.getPostId())
                .orElseThrow(() -> new RestApiException(POST_NOT_FOUND));

        // 댓글 생성
        Comment comment = Comment.builder()
                .message(request.getMessage())
                .userId(userId)
                .post(post)
                .build();

        commentRepository.save(comment);

        post.addCurrentAmount(100L);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentDto.PagedCommentResponse getCommentsByPostId(Long userId, Long postId, Pageable pageable) {
        // 페이지 번호는 0부터 시작하므로, 클라이언트에서 1부터 시작하는 페이지 번호를 보낸다면 조정 필요
        // 여기서는 클라이언트가 0부터 보낸다고 가정합니다.
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RestApiException(POST_NOT_FOUND));

        Page<Comment> commentPage = commentRepository.findByPostId(postId, pageable);

        // N+1 문제 해결을 위해, 현재 페이지의 모든 댓글 작성자 ID를 모아서 한 번에 User 정보를 조회
        // Set을 사용한 이유는 예를들어 userId가 1인 댓글이 여러 개 있을 수 있기 때문에 중복 제거를 위해 Set 사용
        // 같은 사용자를 여러번 조회하지 않도록 하기 위해 사용함
        Set<Long> userIds = commentPage.getContent().stream()
                .map(Comment::getUserId)
                .collect(Collectors.toSet());

        // Map<userId, nickname> 형태로 사용자 닉네임을 미리 가져옴
        // 이렇게 한 번에 가져오는 것이 N+1 문제를 해결하는 핵심이다.
        // 만약 댓글이 100개인데 각각 getUser()를 통해 닉네임을 조회한다면 100번의 쿼리가 발생할 수 있지만, 이 방식은 쿼리 횟수를 1번으로 줄여줍니다. (fetch join 도 있음)
        Map<Long, String> userNicknames = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, User::getNickName));

        // ✨ 좋아요 여부를 한 번에 조회하여 Map으로 만듦 (N+1 문제 방지)
//        Set<Long> likedCommentIdsByUser = new java.util.HashSet<>();
        Set<Long> likedCommentIdsByUser;
        // 로그인한 사용자 ID가 있고, 현재 페이지에 댓글이 있을 경우에만 좋아요 상태를 조회
        if (userId != null && !commentPage.getContent().isEmpty()) {
            List<Long> currentCommentIds = commentPage.getContent().stream()
                    .map(Comment::getId)
                    .collect(Collectors.toList());

            // `findLikedCommentIdsByUserIdAndCommentIdsIn` 메서드를 사용하여 한 번에 조회
            // 조회 결과는 이제 `likedCommentIdsByUser` 변수에 할당됩니다.
            likedCommentIdsByUser = commentLikeRepository.findLikedCommentIdsByUserIdAndCommentIdsIn(userId, currentCommentIds);
        } else {
            // ✨ `if` 조건이 거짓일 경우 여기에 값이 할당됩니다.
            // 이렇게 `else` 블록을 추가함으로써, 어떤 경우에도 likedCommentIdsByUser가 초기화됨이 보장됩니다.
            likedCommentIdsByUser = Collections.emptySet(); // 또는 new HashSet<>()
        }

        // CommentResponse DTO로 변환 시 닉네임 맵과 좋아요 상태 맵 사용
        List<CommentDto.CommentResponse> commentResponses = commentPage.getContent().stream()
                .map(comment -> CommentDto.CommentResponse.builder()
                        .id(comment.getId())
                        .message(comment.getMessage())
                        .userId(comment.getUserId())
                        .nickname(userNicknames.getOrDefault(comment.getUserId(), "알 수 없음"))
                        .createdAt(comment.getCreatedAt())
                        .likesCount(comment.getLikesCount() != null ? comment.getLikesCount() : 0)
                        .isLikedByCurrentUser(likedCommentIdsByUser.contains(comment.getId()))
                        .build()
                )
                .collect(Collectors.toList());

        return CommentDto.PagedCommentResponse.builder()
                .comments(commentResponses)
                .currentPage(commentPage.getNumber())
                .totalPages(commentPage.getTotalPages())
                .totalElements(commentPage.getTotalElements())
                .hasNext(commentPage.hasNext())
                .build();
    }
}
