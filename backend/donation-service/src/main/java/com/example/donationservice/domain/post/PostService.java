package com.example.donationservice.domain.post;

import com.example.donationservice.domain.post.dto.PostDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.time.LocalDateTime;
import java.util.List;

public interface PostService {
    void create(Long userId,PostDto.PostCreateRequest postCreateRequest);

//    Slice<PostDto.PostResponse> getPosts(Pageable pageable);
//    public List<PostDto.PostResponse> getPostsByCategory(Long categoryId, Long lastId, Pageable pageable);
    PostDto.PostResponseWithTotalCount getposts(
            String sortBy,
            Long lastId,
            LocalDateTime lastCreatedAt,
            LocalDateTime lastEndDate,
            Long lastFundingAmount,
            Long lastParticipants,
            Long categoryId,
            int size,
            boolean isInitial);

    PostDto.PostDetailResponse getPostDetilById(Long postId);
}
