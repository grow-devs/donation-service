package com.example.donationservice.domain.comment;

import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.comment.dto.CommentDto;
import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.post.PostRepository;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Override
    @Transactional
    public void createComment(Long userId, CommentDto.CreateCommentRequest request) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(USER_NOT_FOUND));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RestApiException(POST_NOT_FOUND));

        // 댓글 생성
        Comment comment = Comment.builder()
                .message(request.getMessage())
                .userId(userId)
                .post(post)
                .build();

        commentRepository.save(comment);

        // todo: 기부금 100원 기부
    }

    @Override
    @Transactional(readOnly = true)
    public CommentDto.PagedCommentResponse getCommentsByPostId(Long postId, Pageable pageable) {
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

        // CommentResponse DTO로 변환 시 조회한 닉네임 맵 사용
        List<CommentDto.CommentResponse> commentResponses = commentPage.getContent().stream()
                .map(comment -> CommentDto.CommentResponse.from(
                        comment,
                        // 맵에서 닉네임 가져오기. 없으면 "알 수 없음"으로 처리
                        userNicknames.getOrDefault(comment.getUserId(), "알 수 없음")
                ))
                .collect(Collectors.toList());

        // getUser()를 통해 닉네임을 조회한다면 100번의 쿼리가 발생할 수 있나? 참고로 team과 user는 1대1 이고 team에서 user만 참조하는 단방향이다.
//        List<CommentDto.CommentResponse> commentResponses = commentPage.getContent().stream()
//                .map(comment -> CommentDto.CommentResponse.from(comment, post.getTeam().getUser().getNickName()))
//                .collect(Collectors.toList());

        return CommentDto.PagedCommentResponse.builder()
                .comments(commentResponses)
                .currentPage(commentPage.getNumber())
                .totalPages(commentPage.getTotalPages())
                .totalElements(commentPage.getTotalElements())
                .hasNext(commentPage.hasNext())
                .build();
    }
}
