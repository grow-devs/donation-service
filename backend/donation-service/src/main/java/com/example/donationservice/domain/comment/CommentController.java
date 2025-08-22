package com.example.donationservice.domain.comment;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.comment.dto.CommentDto;
import com.example.donationservice.domain.user.CustomUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Result> createComment(@AuthenticationPrincipal CustomUserDetail userDetails,
                                                @RequestBody CommentDto.CreateCommentRequest request) {
        commentService.createComment(userDetails.getUserId(), request);
        return ResponseEntity.ok(
                Result.builder()
                        .message("댓글 생성 성공")
                        .data(null)
                        .build()
        );
    }

    @GetMapping("/list/{postId}")
    public ResponseEntity<Result> getCommentsByPostId(
            @AuthenticationPrincipal CustomUserDetail userDetails,
            @PathVariable Long postId,
            @PageableDefault(size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Long userId = (userDetails != null) ? userDetails.getUserId() : null;

        CommentDto.PagedCommentResponse response = commentService.getCommentsByPostId(userId, postId, pageable);
        return ResponseEntity.ok(
                Result.builder()
                        .message("댓글 조회 성공")
                        .data(response)
                        .build()
        );
    }
}
