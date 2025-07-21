package com.example.donationservice.domain.like;

import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.comment.Comment;
import com.example.donationservice.domain.comment.CommentRepository;
import com.example.donationservice.domain.like.dto.CommentLikeDto;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentLikeServiceImpl implements CommentLikeService {

    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;

    @Override
    @Transactional
    public CommentLikeDto.CommentLikeToggleResponse toggleLike(Long userId, Long commentId) {
        // 1. 사용자 엔티티 조회 (필수)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.USER_NOT_FOUND));

        // 2. 댓글 엔티티 조회 (필수)
        // likesCount 업데이트를 위해 댓글 엔티티를 조회해야 함
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.COMMENT_NOT_FOUND));

        // 3. 기존 좋아요 기록 확인 (존재할 수도 있고, 없을 수도 있어서 Optional 사용)
        // 특정 User와 Comment에 대한 CommentLike가 존재하는지 확인, 이 쿼리는 user_id와 comment_id 두 컬럼을 기준으로 데이터를 찾는다.
        // 이 두 컬럼의 조합으로 **유니크 인덱스(Unique Index)**를 생성해두면 조회 성능을 극대화할 수 있다.
        Optional<CommentLike> existingLike = commentLikeRepository.findByUserAndComment(user, comment);

        boolean isLiked; // 최종 좋아요 상태 (좋아요 = true, 좋아요 취소 = false)

        if(existingLike.isPresent()){
            commentLikeRepository.delete(existingLike.get());
            comment.decrementLikesCount(); // 좋아요 수 감소
            isLiked = false; // 좋아요 취소 상태
        } else {
            CommentLike newLike = CommentLike.builder()
                    .user(user)
                    .comment(comment)
                    .build();

            commentLikeRepository.save(newLike);
            comment.incrementLikesCount(); // 좋아요 수 증가
            isLiked = true; // 좋아요 상태
        }

        commentRepository.save(comment); // 변경된 comment 객체 저장 (likesCount 업데이트)

        return CommentLikeDto.CommentLikeToggleResponse.builder()
                .currentLikesCount(comment.getLikesCount())
                .isLiked(isLiked)
                .build();
    }

}
