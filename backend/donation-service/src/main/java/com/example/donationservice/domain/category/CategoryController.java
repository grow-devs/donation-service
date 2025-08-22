package com.example.donationservice.domain.category;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.post.dto.PostDto;
import com.example.donationservice.domain.user.CustomUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    /**
     * 카테고리 생성 api
     * 관리자만 생성할 수 있다.
     *
     * @param userDetails
     * @param name
     * @return
     */
    @PostMapping("")
    public ResponseEntity<Result> create(
            @RequestBody String name){

        categoryService.create(name);
        return ResponseEntity.ok().body(Result.builder()
                .message("게시글 생성 성공")
                .data(null)
                .build());
    }
}
