// 댓글 목록에서 개별 댓글을 표시하는 데 사용
// CommentItem.jsx

import React from 'react';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa'; // 좋아요 아이콘 (npm install react-icons 필요)

const CommentWrapper = styled.div`
  display: flex;
  align-items: flex-start; /* 프로필 이미지와 텍스트 상단 정렬 */
  padding: 15px 0;
  border-bottom: 1px solid var(--light-gray);
  &:last-child {
    border-bottom: none; /* 마지막 댓글은 하단 선 없음 */
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  background-color: var(--light-gray); /* 이미지 로딩 전/없을 때 배경 */
`;

const DefaultAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0; /* 기본 아바타 배경색 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 0.8em;
  color: #666;
  font-weight: bold;
`;

const CommentContent = styled.div`
  flex-grow: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: baseline; /* 닉네임과 시간 기준선 정렬 */
  margin-bottom: 5px;
`;

const AuthorName = styled.span`
  font-weight: bold;
  font-size: 1em;
  margin-right: 10px;
  color: var(--text-color);
`;

const CommentTime = styled.span`
  font-size: 0.85em;
  color: #999;
`;

const CommentText = styled.p`
  font-size: 0.95em;
  color: var(--secondary-color);
  margin-bottom: 10px;
  word-break: break-word; /* 긴 텍스트 줄바꿈 */
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85em;
  color: #999;
`;

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  color: #999;
  font-size: 0.85em;
  padding: 0;
  margin-right: 15px; /* 좋아요와 다른 액션 사이 간격 */
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-color);
  }
`;

const LikeIcon = styled(FaHeart)`
  margin-right: 5px;
  color: ${props => (props.$isLiked ? 'var(--primary-color)' : '#999')}; /* 좋아요 눌린 상태 색상 */
`;


function CommentItem({ comment }) {
  // 실제 앱에서는 좋아요 상태를 관리하는 로직이 필요합니다.
  // 여기서는 단순히 좋아요 수를 표시합니다.
  const isLiked = false; // 더미 상태

  // ✨ 수정: 백엔드 응답 필드에 맞게 comment 객체 속성 사용
  const displayAuthor = comment.nickname || `사용자 ${comment.userId}`; // 닉네임 없으면 userId 사용
  const displayTime = new Date(comment.createdAt).toLocaleString(); // createdAt을 보기 좋은 시간 형태로 변환
  const displayContent = comment.message; // message 필드 사용
  const displayLikes = comment.likes || 0; // 좋아요 필드 (백엔드에 없으면 0 또는 다른 기본값)

  return (
    <CommentWrapper>
      {/* comment.avatar는 백엔드 응답에 없으므로, 아바타 표시 로직을 nickname 첫 글자로 변경 */}
      {/* 백엔드에서 아바타 URL을 제공하지 않는다면 DefaultAvatar만 사용하거나, UserAvatarPlaceholder와 동일하게 처리 */}
      <DefaultAvatar>{displayAuthor.charAt(0)}</DefaultAvatar> {/* ✨ 수정: displayAuthor의 첫 글자 사용 */}

      <CommentContent>
        <CommentHeader>
          <AuthorName>{displayAuthor}</AuthorName> {/* ✨ 수정: displayAuthor 사용 */}
          <CommentTime>{displayTime}</CommentTime> {/* ✨ 수정: displayTime 사용 */}
        </CommentHeader>
        <CommentText>{displayContent}</CommentText> {/* ✨ 수정: displayContent 사용 */}
        <CommentActions>
          <LikeButton>
            <LikeIcon $isLiked={isLiked} />
            좋아요 {displayLikes} {/* ✨ 수정: displayLikes 사용 */}
          </LikeButton>
          {/* <button>답글 달기</button> (옵션) */}
        </CommentActions>
      </CommentContent>
    </CommentWrapper>
  );
}


export default CommentItem;