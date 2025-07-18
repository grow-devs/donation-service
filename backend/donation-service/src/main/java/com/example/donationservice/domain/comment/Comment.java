package com.example.donationservice.domain.comment;

import com.example.donationservice.common.entity.BaseTimeEntity;
import com.example.donationservice.domain.post.Post;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Comment extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    // todo: 유저 엔티티와 연관관계 설정할건지 말건지, 추가하면 n+1 문제 발생여부 확인
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

}
