package com.example.donationservice.domain.donation;

import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.donation.dto.DonationDto;
import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.post.PostRepository;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DonationServiceImpl implements DonationService{

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    @Override
    @Transactional
    public void createDonation(Long userId, DonationDto.createRequest request) {
//        Post post = postRepository.findById(request.getPostId())
//                .orElseThrow(() -> new RestApiException(CommonErrorCode.POST_NOT_FOUND));
        Post post = postRepository.findByIdWithLock(request.getPostId())
                .orElseThrow(() -> new RestApiException(CommonErrorCode.POST_NOT_FOUND));

//         ddd 방식
        post.addCurrentAmount(request.getPoints());

        // user 포인트 감소
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.USER_NOT_FOUND));

        user.decreasePoints(request.getPoints());

        // db atomic update 방식
//        postRepository.addDonationAmount(request.getPostId(), request.getPoints());
//
//        Post post = postRepository.findById(request.getPostId())
//                .orElseThrow(() -> new RestApiException(CommonErrorCode.POST_NOT_FOUND));

        // 목표 금액 도달 시
        System.out.println("~~~ 현재 금액 : " + post.getCurrentAmount() + ", 목표 금액 : " + post.getTargetAmount() + " ~~~");
        if( post.getCurrentAmount().equals(post.getTargetAmount()) ) {
            System.out.println("이퀄이퀄이퀄 ~~~ 현재 금액 : " + post.getCurrentAmount() + ", 목표 금액 : " + post.getTargetAmount() + " ~~~");
        }

        // 도네이션 세이브
        Donation donation = Donation.builder()
                .point(request.getPoints())
                .user(user)
                .post(post)
                .message(request.getMessage())
                .build();

        donationRepository.save(donation);

        // todo : 비동기 알람 메일 전송
    }
}
