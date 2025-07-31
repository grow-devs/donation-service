-- [게시물 목록 조회 인덱스]
-- 최신순
CREATE INDEX idx_post_created ON post (created_at DESC, id DESC) WHERE approval_status = 1;
CREATE INDEX idx_post_created_category ON post (category_id, created_at DESC, id DESC) WHERE approval_status = 1;

-- 참여자순
CREATE INDEX idx_post_participants ON post (participants DESC, id DESC) WHERE approval_status = 1;
CREATE INDEX idx_post_participants_category ON post (category_id, participants DESC, id DESC) WHERE approval_status = 1;

-- 마감 임박순
CREATE INDEX idx_post_deadline ON post (deadline ASC, id ASC) WHERE approval_status = 1;
CREATE INDEX idx_post_deadline_category ON post (category_id, deadline ASC, id ASC) WHERE approval_status = 1;
