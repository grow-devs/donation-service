package com.example.donationservice.domain.post;

import com.example.donationservice.domain.post.dto.PostDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface PostService {
    void create(Long userId,PostDto.PostCreateRequest postCreateRequest);

    Slice<PostDto.PostResponse> getPosts(Pageable pageable);
}
