package com.example.donationservice.domain.post;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post,Long> {

    Slice<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
