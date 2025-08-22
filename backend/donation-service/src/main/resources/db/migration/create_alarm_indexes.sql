-- [알림 조회 인덱스]
-- 1. select * from alarm a where userid = :userid orderBy created_at DESC
-- 2. select (count) from alarm a where isread = :isread

-- 읽지 않은 알람 count
CREATE INDEX idx_alarm_userid_isread ON alarm (user_id, is_read);
-- 유저의 알림 최신순 조회
CREATE INDEX idx_alarm_userid_createdat ON alarm (user_id, created_at DESC);
