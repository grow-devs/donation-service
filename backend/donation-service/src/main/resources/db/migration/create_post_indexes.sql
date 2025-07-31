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

-- [알림 조회 인덱스]
-- 1. select * from alarm a where userid = :userid orderBy created_at DESC
-- 2. select (count) from alarm a where isread = :isread

-- 읽지 않은 알람 count
CREATE INDEX idx_alarm_userid_isread ON alarm (user_id, is_read);
-- 유저의 알림 최신순 조회
CREATE INDEX idx_alarm_userid_createdat ON alarm (user_id, created_at DESC);
