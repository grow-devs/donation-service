package com.example.donationservice.domain.comment;

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
    public void createComment(@AuthenticationPrincipal CustomUserDetail userDetails,
                              @RequestBody CommentDto.CreateCommentRequest request) {
        commentService.createComment(userDetails.getUserId(), request);
    }

    @GetMapping("/list/{postId}")
    public ResponseEntity<CommentDto.PagedCommentResponse> getCommentsByPostId(
            @PathVariable Long postId,
            @PageableDefault(size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        CommentDto.PagedCommentResponse response = commentService.getCommentsByPostId(postId, pageable);
        return ResponseEntity.ok(response);
    }
}
