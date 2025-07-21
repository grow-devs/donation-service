package com.example.donationservice.domain.like;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.like.dto.CommentLikeDto;
import com.example.donationservice.domain.user.CustomUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment-like")
public class CommentLikeController {

    private final CommentLikeService commentLikeService;

    @PostMapping("/{commentId}")
    public ResponseEntity<Result> toggleCommentLike(
            @AuthenticationPrincipal CustomUserDetail userDetails,
            @PathVariable Long commentId) {
        // userId와 commentId를 이용해 좋아요 상태를 토글하는 서비스 로직 호출
        CommentLikeDto.CommentLikeToggleResponse response = commentLikeService.toggleLike(userDetails.getUserId(), commentId);
        return ResponseEntity.ok(
                Result.builder()
                        .message("댓글 좋아요 상태 토글 성공")
                        .data(response)
                        .build()
        );
    }
}
