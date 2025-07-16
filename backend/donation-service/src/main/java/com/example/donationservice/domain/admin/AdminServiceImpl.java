package com.example.donationservice.domain.admin;

import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.post.PostRepository;
import com.example.donationservice.domain.post.dto.PostDto;
import com.example.donationservice.domain.sponsor.Team;
import com.example.donationservice.domain.sponsor.TeamRepository;
import com.example.donationservice.domain.sponsor.dto.TeamDto;
import com.example.donationservice.domain.user.ApprovalStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{

    private final TeamRepository teamRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional
    public Page<TeamDto.response> getTeamList(Pageable pageable, ApprovalStatus approvalStatus) {
        Page<Team> teamList;

        if(approvalStatus == null){
            teamList = teamRepository.findAllByOrderByCreatedAtDesc(pageable);
        } else {
            teamList = teamRepository.findByApprovalStatusOrderByCreatedAtDesc(pageable, approvalStatus);
        }

        return teamList.map(team -> TeamDto.response.builder()
                .teamId(team.getId())
                .name(team.getName())
                .address(team.getAddress())
                .description(team.getDescription())
                .createdAt(team.getCreatedAt())
                .approvalStatus(team.getApprovalStatus().name())
                .build());
    }

    @Override
    @Transactional
    public void updateTeamApprovalStatus(Long teamId, ApprovalStatus approvalStatus) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("팀을 찾을 수 없습니다."));

        // 요청한 팀 상태를 수락 및 반려
        team.updateTeamApprovalStatus(approvalStatus);
        teamRepository.save(team);
    }

    @Override
    @Transactional
    public void updatePostApprovalStatus(Long postId, ApprovalStatus approvalStatus) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 요청한 게시글 상태를 수락 및 반려
        post.updateApprovalStatus(approvalStatus);
        postRepository.save(post);
    }

    @Override
    @Transactional
    public Page<PostDto.PostResponse> getPostList(Pageable pageable, ApprovalStatus approvalStatus) {
        // repository 에서 페이징 조회
        Page<Post> postList;

        if(approvalStatus == null){
            postList = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        } else {
            postList = postRepository.findByApprovalStatusOrderByCreatedAtDesc(pageable, approvalStatus);
        }

        // Post -> PostResponse DTO 변환
        return postList.map(post -> PostDto.PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .currentAmount(post.getCurrentAmount())
                .targetAmount(post.getTargetAmount())
                .deadline(post.getDeadline())
                .imageUrl(post.getImageUrl())
                .approvalStatus(post.getApprovalStatus())
                .teamId(post.getTeam().getId())
                .teamName(post.getTeam().getName())
                .categoryId(post.getCategory().getId())
                .categoryName(post.getCategory().getName())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build()
        );
    }
}
