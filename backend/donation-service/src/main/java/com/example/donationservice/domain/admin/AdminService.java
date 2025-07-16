package com.example.donationservice.domain.admin;

import com.example.donationservice.domain.post.dto.PostDto;
import com.example.donationservice.domain.sponsor.dto.TeamDto;
import com.example.donationservice.domain.user.ApprovalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface AdminService {
    Page<TeamDto.response> getTeamList(Pageable pageable, ApprovalStatus approvalStatus);

    // 유저가 요청한 팀 승인
    void updateTeamApprovalStatus(Long teamId, ApprovalStatus approvalStatus);

    Page<PostDto.PostResponse> getPostList(Pageable pageable, ApprovalStatus approvalStatus);

    // 게시물 수락 및 반려
    void updatePostApprovalStatus(Long postId, ApprovalStatus approvalStatus);
}
