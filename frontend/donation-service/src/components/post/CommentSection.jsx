// 게시물 페이지 하단에 공통으로 나타나는 댓글 입력 영역과 댓글 목록 전체를 담당합니다. 댓글 입력 폼, 댓글 목록 정렬 옵션, 그리고 개별 댓글들을 표시하기 위해 CommentItem 컴포넌트를 사용합니다.
// CommentSection.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import CommentItem from './CommentItem'; // CommentItem 컴포넌트 임포트

const SectionContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-top: 30px; /* 상단 게시물 섹션과의 간격 */

  @media (max-width: 768px) {
    padding: 15px; /* 모바일에서 패딩 줄이기 */
  }
`;

const CommentTitle = styled.h2`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--text-color);
`;

const CommentInputWrapper = styled.div`
  display: flex;
  margin-bottom: 30px;
  border: 1px solid #B3B3B3;
  border-radius: 8px;
  overflow: hidden; /* textarea 내부 요소 삐져나오는 것 방지 */
`;

const UserAvatarPlaceholder = styled.div`
  width: 50px;
  min-width: 50px; /* 고정 너비 */
  height: 50px;
  border-radius: 50%;
  background-color: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  color: #888;
  font-weight: bold;
  margin: 10px; /* 입력창 내에서 간격 */
`;

const CommentTextArea = styled.textarea`
  flex-grow: 1; /* 남은 공간 모두 차지 */
  border: none;
  padding: 15px;
  font-size: 1em;
  resize: vertical; /* 세로 방향으로만 크기 조절 가능 */
  min-height: 50px;
  outline: none; /* 포커스 시 외곽선 제거 */
  font-family: inherit; /* 전역 폰트 상속 */

  &::placeholder {
    color: #bbb;
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1em;
  margin: 10px; /* 입력창 내에서 간격 */
  align-self: flex-end; /* 아래쪽에 정렬 */
  
  &:hover {
    background-color: #e0acb2; /* 호버 시 약간 어두워지게 */
  }
  &:disabled {
    background-color: var(--light-gray);
    color: #aaa;
    cursor: not-allowed;
  }
`;

const CommentListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
`;

const CommentCount = styled.span`
  font-size: 1em;
  font-weight: bold;
  color: var(--text-color);
`;

const SortOptions = styled.div`
  display: flex;
  gap: 15px;
`;

const SortButton = styled.button`
  font-size: 0.95em;
  color: ${props => (props.$isActive ? 'var(--primary-color)' : 'var(--secondary-color)')};
  font-weight: ${props => (props.$isActive ? 'bold' : 'normal')};
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  &:hover {
    color: var(--primary-color);
  }
`;

const CommentList = styled.div`
  /* 댓글 아이템들이 여기에 나열됩니다. */
`;

function CommentSection({ comments }) {
  const [newComment, setNewComment] = useState('');
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' 또는 'cheer'

  // 실제 앱에서는 로그인한 사용자의 아바타를 가져와야 합니다.
  const currentUserAvatar = ''; // 현재 사용자의 아바타 (더미)
  const currentUserName = 'Guest'; // 현재 사용자 이름 (더미)

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // 실제 앱에서는 API를 통해 서버에 댓글을 전송하고,
      // 성공 시 댓글 목록을 업데이트하는 로직이 필요합니다.
      console.log('새 댓글 제출:', newComment);
      setNewComment(''); // 입력창 비우기
      alert('댓글이 제출되었습니다. (실제 기능은 서버 연동 필요)');
    }
  };

  // 댓글 정렬 로직 (더미 데이터에 대한 단순 정렬)
  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === 'latest') {
      // 날짜 기반 정렬 (예시: 실제 날짜 객체로 변환하여 비교)
      // 여기서는 더미 데이터의 id를 기준으로 최신순으로 정렬
      return b.id - a.id;
    } else if (sortOrder === 'cheer') {
      // 좋아요 수 기준 정렬
      return b.likes - a.likes;
    }
    return 0;
  });

  return (
    <SectionContainer>
      <CommentTitle>댓글</CommentTitle>

      {/* 댓글 입력창 */}
      <CommentInputWrapper>
        {currentUserAvatar ? (
          <UserAvatarPlaceholder as="img" src={currentUserAvatar} alt="내 아바타" />
        ) : (
          <UserAvatarPlaceholder>{currentUserName.charAt(0)}</UserAvatarPlaceholder>
        )}
        <CommentTextArea
          placeholder="따뜻한 응원 댓글을 남겨주세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <SubmitButton onClick={handleCommentSubmit} disabled={!newComment.trim()}>
          등록
        </SubmitButton>
      </CommentInputWrapper>

      {/* 댓글 목록 헤더 (정렬 옵션) */}
      <CommentListHeader>
        <CommentCount>댓글 {comments.length}개</CommentCount>
        <SortOptions>
          <SortButton
            $isActive={sortOrder === 'latest'}
            onClick={() => setSortOrder('latest')}
          >
            최신순
          </SortButton>
          <SortButton
            $isActive={sortOrder === 'cheer'}
            onClick={() => setSortOrder('cheer')}
          >
            응원순
          </SortButton>
        </SortOptions>
      </CommentListHeader>

      {/* 댓글 목록 */}
      <CommentList>
        {sortedComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && <p style={{textAlign: 'center', color: '#888', padding: '20px 0'}}>아직 댓글이 없습니다.</p>}
      </CommentList>
    </SectionContainer>
  );
}

export default CommentSection;