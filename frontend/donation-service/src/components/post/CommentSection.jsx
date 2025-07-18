// 게시물 페이지 하단에 공통으로 나타나는 댓글 입력 영역과 댓글 목록 전체를 담당합니다. 댓글 입력 폼, 댓글 목록 정렬 옵션, 그리고 개별 댓글들을 표시하기 위해 CommentItem 컴포넌트를 사용합니다.
// CommentSection.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CommentItem from './CommentItem'; // CommentItem 컴포넌트 임포트
import api from '../../apis/api';

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

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 12px 0;
  margin-top: 20px;
  background-color: white;
  color: black; // 글자색
  border: 1px solid #adaaaa; /* 예시: 두께 1px, 실선, 금색 테두리 */
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition: background-color 0.2s ease;

  // ✨ 1. 가운데 정렬 추가
  display: block; // 블록 요소로 만들어 margin: auto 적용 가능하게 함
  margin-left: auto;
  margin-right: auto;
  max-width: 160px; // 버튼의 최대 너비를 지정하여 가운데 정렬이 더 잘 보이게 할 수 있음 (선택 사항)

  &:hover:not(:disabled) {
    background-color: #dedcdc;
  }
  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
  }
`;

const CommentList = styled.div`
  /* 댓글 아이템들이 여기에 나열됩니다. */
`;
// comments
function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  // const [sortOrder, setSortOrder] = useState('latest'); // 'latest' 또는 'cheer'
  const [currentPage, setCurrentPage] = useState(0);// ✨ 추가: 현재 페이지 번호 (0부터 시작)
  const [hasMore, setHasMore] = useState(true); // ✨ 추가: 더 불러올 댓글이 있는지 여부
  const [loading, setLoading] = useState(false); // ✨ 추가: API 호출 로딩 중 여부

  const [currentSort, setCurrentSort] = useState('updatedAt,desc');

  // 실제 앱에서는 로그인한 사용자의 아바타를 가져와야 합니다.
  const currentUserAvatar = ''; // 현재 사용자의 아바타 (더미)
  const currentUserName = 'Guest'; // 현재 사용자 이름 (더미)

  // 백엔드에서 댓글 데이터를 비동기적으로 가져오는 함수입니다
  const fetchComments = async (page, sort = currentSort) => {
    setLoading(true); // 로딩 상태 시작
    try {
      const [sortBy, sortDirection] = sort.split(','); // 예: "updatedAt,desc" -> ["updatedAt", "desc"]

      // ✨ api.js에서 가져온 api 인스턴스 사용
      const response = await api.get(`/comment/list/${postId}`, {
        params: {
          page: page,
          size: 10, // 백엔드의 @PageableDefault와 동일
          sort: `${sortBy},${sortDirection}`, // 백엔드 sort 파라미터 형식에 맞춰 전달
        },
      });

      const fetchedComments = response.data.comments;
      if (page === 0) { // 첫 페이지 로드 (초기 로드 또는 정렬 변경 시)
        setComments(fetchedComments); // 기존 댓글 초기화 후 새 댓글로 채움
      } else { // '더보기'로 다음 페이지 로드
        setComments((prevComments) => [...prevComments, ...fetchedComments]); // 기존 댓글에 새 댓글 추가
      }

      setCurrentPage(response.data.currentPage + 1); // 백엔드에서 받은 현재 페이지 번호 + 1 (다음 요청 시 사용)
      setHasMore(response.data.hasNext); // 백엔드 응답에서 다음 페이지 존재 여부 확인
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
      // 에러 처리 (예: 사용자에게 메시지 표시)
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  // useEffect를 이용한 초기 댓글 로드 및 정렬 변경 감지
  // 컴포넌트가 처음 마운트되거나 postId, currentSort 상태가 변경될 때 댓글을 다시 불러옵니다.
  // ✨ 추가: 컴포넌트 마운트 시 또는 postId, 정렬 기준 변경 시 초기 댓글 로드
  useEffect(() => {
    if (postId) { // postId가 유효할 때만 실행
      // 새로운 게시물 또는 정렬 기준 변경 시 댓글 목록 상태를 초기화하고 첫 페이지를 로드합니다.
      setComments([]);
      setCurrentPage(0);
      setHasMore(true);
      fetchComments(0, currentSort); // 첫 페이지를 현재 정렬 기준으로 로드
    }
  }, [postId, currentSort]); // ✨ 수정: 의존성 배열에 postId와 currentSort 추가

  // 더보기' 버튼 클릭 시 다음 페이지의 댓글을 로드하는 함수
  // ✨ 추가: '더보기' 버튼 클릭 핸들러
  const handleLoadMore = () => {
    if (!loading && hasMore) { // 로딩 중이 아니고 더 불러올 댓글이 있을 때만 동작
      fetchComments(currentPage, currentSort); // 다음 페이지를 현재 정렬 기준으로 로드
    }
  };

  // 댓글 제출 성공 시, 댓글 목록을 새로고침하여 방금 작성한 댓글이 즉시 보이도록 한다.
  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      setLoading(true); // 등록 중 로딩 상태 표시
      try {
        // ✨ 수정: api.js에서 가져온 api 인스턴스 사용
        await api.post('/api/comment', {
          postId: postId, // 댓글 등록 시 게시물 ID 필요
          comment: newComment,
          // teamId: 필요하다면 CommentDto.CreateCommentRequest에 맞춰 추가
        });
        setNewComment(''); // 입력창 비우기
        alert('댓글이 성공적으로 등록되었습니다!');
        // ✨ 수정: 댓글 등록 후 첫 페이지부터 다시 로드하여 최신 댓글 포함
        fetchComments(0, currentSort); // 현재 정렬 기준으로 첫 페이지부터 다시 로드
      } catch (error) {
        console.error('댓글 등록 실패:', error);
        alert('댓글 등록에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false); // 로딩 종료
      }
    }
  };

  // ✨ 정렬 버튼 클릭 핸들러
  const handleSortChange = (newSort) => {
    if (currentSort !== newSort) { // 현재 정렬과 다를 때만 변경
      setCurrentSort(newSort); // 정렬 상태 업데이트 (useEffect가 이를 감지하여 댓글 재로드)
    }
  };

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
            // ✨ 수정: 활성화 조건과 클릭 핸들러
            $isActive={currentSort === 'updatedAt,desc'}
            onClick={() => handleSortChange('updatedAt,desc')}
          >
            최신순
          </SortButton>
          <SortButton
            // ✨ 수정: 활성화 조건과 클릭 핸들러 (예: '응원순' 대신 '오래된순'으로 매핑)
            $isActive={currentSort === 'createdAt,asc'}
            onClick={() => handleSortChange('createdAt,asc')}
          >
            오래된순
          </SortButton>
        </SortOptions>
      </CommentListHeader>

      {/* 댓글 목록 */}
      {/* 댓글 목록 */}
      <CommentList>
        {comments.length > 0 ? ( // ✨ 수정: sortedComments 대신 comments 상태 사용
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          // ✨ 수정: 로딩 중이 아닐 때만 "댓글 없음" 메시지 표시
          !loading && <p style={{textAlign: 'center', color: '#888', padding: '20px 0'}}>아직 댓글이 없습니다.</p>
        )}
      </CommentList>

      {/* ✨ 추가: 로딩 인디케이터 */}
      {loading && <p style={{ textAlign: 'center', color: '#888', padding: '20px 0' }}>댓글 불러오는 중...</p>}

      {/* ✨ 추가: '더보기' 버튼 */}
      {hasMore && ( // 더 불러올 댓글이 있을 때만 버튼 표시
        <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
          {loading ? '불러오는 중...' : '더보기  ⌄'} {/* ⌄ */}
        </LoadMoreButton>
      )}

      {/* ✨ 추가: 더 이상 댓글이 없을 때 메시지 (선택 사항) */}
      {!hasMore && !loading && comments.length > 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-color)' }}>더 이상 댓글이 없습니다.</p>
      )}

    </SectionContainer>
  );
}

export default CommentSection;