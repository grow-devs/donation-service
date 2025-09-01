package com.example.donationservice.domain.post;

import com.example.donationservice.domain.post.dto.PostDto;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// Q클래스 임포트 (QPost는 프로젝트 빌드 시 자동으로 생성됩니다)
import static com.example.donationservice.domain.post.QPost.post;
import static com.example.donationservice.domain.user.ApprovalStatus.ACCEPTED;

@Repository
@RequiredArgsConstructor
public class PostRepositoryImpl implements PostRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<PostDto.PostResponse> findPostsByCursor(
            String sortBy,
            Long lastId,
            LocalDateTime lastCreatedAt,
            LocalDateTime lastEndDate,
            Long lastFundingAmount,
            Long lastParticipants,
            Long categoryId,
            int size) {
        // Q클래스 인스턴스는 static import 했으므로 바로 'post' 사용 가능
        // QPost post = QPost.post; // 이 줄은 static import로 대체됩니다.

        // 1. Where 절 (커서 기반 조건) 구성
        // 이 부분에서 기존의 복잡한 WHERE 절을 동적으로 생성합니다.
        BooleanExpression cursorCondition = createCursorCondition(
                sortBy, lastId, lastCreatedAt, lastEndDate, lastFundingAmount, lastParticipants
        );

        // 2. 카테고리 필터링 조건
        BooleanExpression categoryCondition = (categoryId != null && categoryId != 0) ? post.category.id.eq(categoryId) : null;

        // 3. 수락한 게시물 필터링 조건
        BooleanExpression approvalCondition = post.approvalStatus.eq(ACCEPTED); // todo 시나리오 테스트를 할 시에는 "PENDING"상태여도 조회할 수 있게 주석 -> 해당 조건이 있어야 인덱스를 탈 것이다.

        // 4. 정렬 조건 (OrderSpecifier) 구성
        // 정렬 순서에 따라 동적으로 OrderSpecifier를 생성합니다.
        OrderSpecifier<?>[] orderSpecifiers = createOrderSpecifiers(sortBy);

        return queryFactory
                .selectFrom(post)
                .where(cursorCondition, categoryCondition,approvalCondition) // 조건들을 쉼표로 나열하면 AND로 연결됨
                .orderBy(orderSpecifiers)
                .limit(size)
                .fetch()
                .stream()
                .map(PostDto::from)
                .collect(Collectors.toList());// 결과 리스트 반환
    }

    /**
     * where절 :
     * 커서 기반 (lastId 기반) WHERE 절을 동적으로 생성합니다.
     * 첫 페이지 요청 시 (모든 lastXXX 값이 null)에는 null을 반환하여 조건 없이 진행합니다.
     */
    private BooleanExpression createCursorCondition(
            String sortBy,
            Long lastId,
            LocalDateTime lastCreatedAt,
            LocalDateTime lastEndDate,
            Long lastFundingAmount,
            Long lastParticipants
    ) {
        // 첫 페이지 요청 (lastId가 null이면 모든 lastXXX 값도 null이라고 가정)
        if (lastId == null) {
            return null;
        }

//        case "latest":

        // 다음 페이지 요청 시, sortBy에 따라 적절한 커서 조건을 반환
        // 인덱싱을 위해서 or 조건
        // 예시 : (WHERE post.deadline > :lastEndDate OR (post.deadline = :lastEndDate AND post.id > :lastId)
        // 대신, booleanTemplate을 사용해서 복합 인덱스를 잘 탈 수 있게 한다.

        switch (sortBy) {
            case "latest": // 최신순 (createdAt DESC, id DESC)
                return Expressions.booleanTemplate(
                        "( {0}, {1} ) < ( {2}, {3} )",
                        post.createdAt, post.id,
                        lastCreatedAt, lastId
                ); // 복합 인덱스 활용을 위해 코드 변경
            case "deadlineAsc": // 종료임박순 (endDate ASC, id ASC)
                return Expressions.booleanTemplate(
                        "( {0}, {1} ) > ( {2}, {3} )",
                        post.deadline,post.id,
                        lastEndDate,lastId
                );
            case "amountDesc": // 모금액 많은 순 (currentFundingAmount DESC, id DESC)
                return Expressions.booleanTemplate(
                        "( {0}, {1} ) < ( {2}, {3} )",
                        post.currentAmount,post.id,
                        lastFundingAmount,lastId
                );
            case "participantsDesc": // 참여인원 많은 순 (participants DESC, id DESC)
                return Expressions.booleanTemplate(
                        "( {0}, {1} ) < ( {2}, {3} )",
                        post.participants,post.id,
                        lastParticipants,lastId
                );
            default:
                // 기본값 (예: latest)에 대한 조건. 없으면 첫 페이지 로드와 동일하게 동작
                return post.createdAt.lt(lastCreatedAt)
                        .or(post.createdAt.eq(lastCreatedAt).and(post.id.lt(lastId)));
        }
    }

    /**
     * orderBy : 정렬 기준에 맞는 OrderSpecifier 배열을 동적으로 생성합니다.
     * post.id.desc()와 post.id.asc()는 결과가 중복되거나 일부가 건너뛰어지는것을 방지한다. (데이터 일관성이 깨짐)
     */
    private OrderSpecifier<?>[] createOrderSpecifiers(String sortBy) {
        switch (sortBy) {
            case "latest": // 최신순: createdAt DESC, id DESC
                return new OrderSpecifier[]{
                        post.createdAt.desc(),
                        post.id.desc()
                };
            case "deadlineAsc": // 종료임박순: endDate ASC, id ASC
                return new OrderSpecifier[]{
                        post.deadline.asc(),
                        post.id.asc()
                };
            case "amountDesc": // 모금액 많은 순: currentFundingAmount DESC, id DESC
                return new OrderSpecifier[]{
                        post.currentAmount.desc(),
                        post.id.desc()
                };
            case "participantsDesc": // 참여인원 많은 순: participants DESC, id DESC
                return new OrderSpecifier[]{
                        post.participants.desc(),
                        post.id.desc()
                };
            default: // 기본값: 최신순
                return new OrderSpecifier[]{
                        post.createdAt.desc(),
                        post.id.desc()
                };
        }
    }
}
