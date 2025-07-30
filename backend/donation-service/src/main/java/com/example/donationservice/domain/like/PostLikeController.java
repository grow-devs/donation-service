package com.example.donationservice.domain.like;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.like.dto.PostLikeDto;
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
@RequestMapping("/api/post-like")
public class PostLikeController {

    private final PostLikeService postLikeService;

    @PostMapping("/{postId}")
    public ResponseEntity<Result> addPostLike(
            @AuthenticationPrincipal CustomUserDetail userDetails,
            @PathVariable Long postId) {
        // userId와 postId를 이용해 좋아요 상태를 토글하는 서비스 로직 호출
        PostLikeDto.PostLikeToggleResponse response = postLikeService.addLike(userDetails.getUserId(), postId);
        return ResponseEntity.ok(
                Result.builder()
                        .message("게시글 좋아요 성공")
                        .data(response)
                        .build()
        );
    }
}
