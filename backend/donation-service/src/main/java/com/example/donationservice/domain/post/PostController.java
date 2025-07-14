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
            @RequestBody PostDto.PostCreateRequest postCreateRequest){

        postService.create(userDetails.getUserId(), postCreateRequest);
        return ResponseEntity.ok().body(Result.builder()
                .message("게시글 생성 성공")
                .data(null)
                .build());
    }

    /**
     * 기본 10개씩 updateTime을 기준으로 내림차순 정렬된 post를 가져온다.
     * http://localhost:8080/api/post?page=0&size=10&sort=createdAt,desc와 같이 요청받는다.
     * @param pageable
     * @return
     */
    @GetMapping("")
    public ResponseEntity<Result> getPosts(
            @PageableDefault(size = 10,sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ){
        return ResponseEntity.ok().body(Result.builder()
                .message("게시글 목록 조회 성공")
                .data(postService.getPosts(pageable))
                .build());
    }
}
