package com.example.donationservice.domain.donation;

import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.donation.dto.DonationDto;
import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.post.PostRepository;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import com.example.donationservice.event.DonationGoalReachedEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonationServiceImpl implements DonationService{

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    private final DonationGoalReachedEventPublisher donationGoalReachedEventPublisher;

    @Override
    @Transactional
    public void createDonation(Long userId, DonationDto.createRequest request) {
//        Post post = postRepository.findById(request.getPostId())
//                .orElseThrow(() -> new RestApiException(CommonErrorCode.POST_NOT_FOUND));
        Post post = postRepository.findByIdWithLock(request.getPostId())
                .orElseThrow(() -> new RestApiException(CommonErrorCode.POST_NOT_FOUND));

//         ddd 방식
        post.addCurrentAmount(request.getPoints());
        // 참여자 증가 단 한명이 여러번 기부해도 1명 증가
        boolean isFirstDonor = !donationRepository.existsByUserIdAndPostId(userId, post.getId());
        if(isFirstDonor) {
            post.incrementParticipants();
        }

        // user 포인트 감소
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.USER_NOT_FOUND));

        user.decreasePoints(request.getPoints());

        // 도네이션 세이브
        Donation donation = Donation.builder()
                .point(request.getPoints())
                .user(user)
                .post(post)
                .message(request.getMessage())
                .build();

        donationRepository.save(donation);

        // 최초로 목표 금액에 도달했을 때만 이벤트 발행
        if( post.getCurrentAmount() >= post.getTargetAmount() &&
                !post.getGoalReached()) {
            log.info("목표 금액 도달! postId = {}", post.getId());

            post.updateGoalReached();
            // 해당 게시물에 기부한 유저들의 이메일을 추출 (중복 제거)
            List<String> donorEmails = donationRepository.findDistinctUserEmailsByPostId(post.getId());

            // 이벤트 발행 (비동기 메일 전송 트리거)
            donationGoalReachedEventPublisher.publish(post, donorEmails);

            // 퍼블리셔나 리스너에서 조회하면 이미 트랜잭션이 끝난 이후이기 때문에 지연 로딩 실패나 LazyInitializationException이 발생할 수 있음.
            // 리스너/퍼블리셔는 인프라 역할에 집중 그러므로 여기서 user엔터티 리스트를 조회한다.
            List<User> donorUsers = userRepository.findByEmailIn(donorEmails);

            donationGoalReachedEventPublisher.publishAlarmEvent(post, donorUsers);
        }
    }

    @Override
    @Transactional
    public Page<DonationDto.response> getDonationsByPostId(Long postId, Pageable pageable) {
        // 도네이션 목록 페이지 조회
        Page<Donation> donationPage = donationRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable);

        // 도네이션 페이지를 DTO로 변환
        return donationPage.map(donation -> DonationDto.response.builder()
                .id(donation.getId())
                .postId(donation.getPost().getId())
                .userId(donation.getUser().getId())
                .nickname(donation.getUser().getNickName())
                .points(donation.getPoint())
                .message(donation.getMessage())
                .createdAt(donation.getCreatedAt())
                .build());
    }
}
