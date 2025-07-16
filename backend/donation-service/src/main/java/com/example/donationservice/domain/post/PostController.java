package com.example.donationservice.domain.post;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.post.dto.PostDto;
import com.example.donationservice.domain.user.CustomUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    /**
     * 회원만이 팀을 생성할 수 있다. (권한을 가진다는 느낌)
     * @param userDetails
     * @param postCreateRequest
     * @return
     */
    @PostMapping("")
    public ResponseEntity<Result> create(
            @AuthenticationPrincipal CustomUserDetail userDetails,
            @ModelAttribute PostDto.PostCreateRequest postCreateRequest){
        postService.create(userDetails.getUserId(), postCreateRequest);
        return ResponseEntity.ok().body(Result.builder()
                .message("게시글 생성 성공")
                .data(null)
                .build());
    }

    /**
     * 무한스크롤 방식 -
     * @param categoryId
     * @return
     * LocalDateTime 대신 timestamp(long)으로 보내서 Instant.ofEpochMilli()로 변환
     * sortBy를 Enum으로 만들어서 컨트롤러에서 받을 때 안전하게 파싱을 고려려
     *
     * !단, 인덱스 필요 !
     * */

    @GetMapping("")
    public ResponseEntity<Result> getPostsByCategory(
            @RequestParam(name = "sortBy", defaultValue = "latest") String sortBy,
            @RequestParam(name = "lastId", required = false) Long lastId,
            @RequestParam(name = "lastCreatedAt", required = false) LocalDateTime lastCreatedAt,
            @RequestParam(name = "lastEndDate", required = false) LocalDateTime lastEndDate,
            @RequestParam(name = "lastFundingAmount", required = false) Long lastFundingAmount,
            @RequestParam(name = "lastParticipants", required = false) Long lastParticipants,
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "size", defaultValue = "20") int size,
            // 처음 카테고리별 게시물 목록을 조회할때만 count 쿼리를 날릴 수 있게 inInitial 값을 추가
            @RequestParam(name = "initialLoad",defaultValue = "true") boolean initialLoad){

        PostDto.PostResponseWithTotalCount posts = postService.getposts(
                sortBy, lastId, lastCreatedAt, lastEndDate, lastFundingAmount,
                lastParticipants, categoryId, size , initialLoad
        );
        return ResponseEntity.ok().body(Result.builder()
                .message("게시글 목록 조회 성공")
                .data(posts)
                .build());
    }
}
