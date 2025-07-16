package com.example.donationservice.domain.post;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Querydsl이 제공하는 QuerydslPredicateExecutor를 상속받아 더 유연한 쿼리도 가능하지만,
// 현재는 PostRepositoryCustom을 상속받아 커스텀 메서드를 사용합니다.
public interface PostRepository extends JpaRepository<Post,Long>,PostRepositoryCustom {
    Long countByCategoryId(Long CategoryId);

    Slice<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

}
