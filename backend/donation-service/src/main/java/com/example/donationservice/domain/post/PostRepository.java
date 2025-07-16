package com.example.donationservice.domain.post;

import com.example.donationservice.domain.user.ApprovalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post,Long> {

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Post> findByApprovalStatusOrderByCreatedAtDesc(Pageable pageable, ApprovalStatus approvalStatus);
}
