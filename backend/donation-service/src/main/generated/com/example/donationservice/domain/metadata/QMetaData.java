package com.example.donationservice.domain.metadata;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QMetaData is a Querydsl query type for MetaData
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMetaData extends EntityPathBase<MetaData> {

    private static final long serialVersionUID = -1173333472L;

    public static final QMetaData metaData = new QMetaData("metaData");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> totalAmount = createNumber("totalAmount", Long.class);

    public QMetaData(String variable) {
        super(MetaData.class, forVariable(variable));
    }

    public QMetaData(Path<? extends MetaData> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMetaData(PathMetadata metadata) {
        super(MetaData.class, metadata);
    }

}

