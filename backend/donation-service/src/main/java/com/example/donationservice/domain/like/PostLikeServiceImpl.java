package com.example.donationservice.domain.like;

import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.like.dto.PostLikeDto;
import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.post.PostRepository;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostLikeServiceImpl implements PostLikeService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostLikeRepository postLikeRepository;

    @Override
    @Transactional
    public PostLikeDto.PostLikeResponse addLike(Long userId, Long postId) {
        // 1. 사용자가 게시글을 좋아요 했는지 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.USER_NOT_FOUND));

        // 비관락으로 게시글을 조회한다.
        Post post = postRepository.findByIdWithLock(postId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.POST_NOT_FOUND));

        Optional<PostLike> existingLike = postLikeRepository.findByUserAndPost(user, post);

        // 참고로 게시글 좋아요는 취소가 불가능하다.
        if( existingLike.isPresent() ) {
            throw new RestApiException(CommonErrorCode.POST_LIKE_ALREADY_EXISTS);
        } else {
            // 2. 좋아요가 없다면 새로 생성
            PostLike postLike = PostLike.builder()
                    .user(user)
                    .post(post)
                    .build();

            postLikeRepository.save(postLike);
            post.incrementLikesCount(); // 게시글 좋아요 수 증가
            post.addCurrentAmount(100L); // 게시글 좋아요 시 100 포인트 추가
        }

        return PostLikeDto.PostLikeResponse.builder()
                .currentLikesCount(post.getLikesCount())
                .build();

    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkLike(Long userId, Long postId) {
        // todo : 굳이 user랑 post를 확인하는 절차가 필요있을까?
        // 확인하는 이유는 사용자가 존재하는지, 게시글이 존재하는지 확인하기 위함이다.
        // 그런데 사실상 있어서 쿼러만 더 늘어나는 것 같기도 하다.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.USER_NOT_FOUND));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.POST_NOT_FOUND));

        return postLikeRepository.findByUserAndPost(user, post).isPresent();
    }
}
