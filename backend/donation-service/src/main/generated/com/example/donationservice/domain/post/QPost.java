package com.example.donationservice.domain.post;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPost is a Querydsl query type for Post
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPost extends EntityPathBase<Post> {

    private static final long serialVersionUID = 1411083808L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPost post = new QPost("post");

    public final com.example.donationservice.common.entity.QBaseTimeEntity _super = new com.example.donationservice.common.entity.QBaseTimeEntity(this);

    public final EnumPath<com.example.donationservice.domain.user.ApprovalStatus> approvalStatus = createEnum("approvalStatus", com.example.donationservice.domain.user.ApprovalStatus.class);

    public final com.example.donationservice.domain.category.QCategory category;

    public final StringPath content = createString("content");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> currentAmount = createNumber("currentAmount", Long.class);

    public final DateTimePath<java.time.LocalDateTime> deadline = createDateTime("deadline", java.time.LocalDateTime.class);

    public final StringPath displayImageUrl = createString("displayImageUrl");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> participants = createNumber("participants", Long.class);

    public final NumberPath<Long> targetAmount = createNumber("targetAmount", Long.class);

    public final com.example.donationservice.domain.sponsor.QTeam team;

    public final StringPath thumnbnailImageUrl = createString("thumnbnailImageUrl");

    public final StringPath title = createString("title");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QPost(String variable) {
        this(Post.class, forVariable(variable), INITS);
    }

    public QPost(Path<? extends Post> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPost(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPost(PathMetadata metadata, PathInits inits) {
        this(Post.class, metadata, inits);
    }

    public QPost(Class<? extends Post> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.category = inits.isInitialized("category") ? new com.example.donationservice.domain.category.QCategory(forProperty("category")) : null;
        this.team = inits.isInitialized("team") ? new com.example.donationservice.domain.sponsor.QTeam(forProperty("team"), inits.get("team")) : null;
    }

}

