package com.example.donationservice.domain.comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPostIdOrderByUpdatedAtDesc(Long postId, Pageable pageable);
    Page<Comment> findByPostId(Long postId, Pageable pageable);
}
