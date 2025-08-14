// CommentItem.jsx
import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // 채워진 하트, 비워진 하트 아이콘
import api from '../../apis/api'; // API 모듈 경로 확인 필요

// --- 스타일 컴포넌트 (MUI styled() 활용) ---

// 댓글 전체 래퍼
const CommentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: '18px 0',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

// 댓글 내용 컨테이너
const CommentContent = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

// 댓글 헤더 (작성자 닉네임, 시간)
const CommentHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '6px',
});

// 작성자 닉네임 (Typography 컴포넌트 사용)
const AuthorName = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  fontSize: '1.05em',
  marginRight: '12px',
  color: theme.palette.text.primary,
}));

// 댓글 시간
const CommentTime = styled(Typography)(({ theme }) => ({
  marginLeft: '10px',
  fontSize: '0.8em',
  color: theme.palette.text.secondary,
}));

// ✨ 댓글 내용 말풍선 스타일 (크기 유동적으로 조정)
const CommentTextBubble = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[100], // 말풍선 배경색
  color: theme.palette.text.primary,
  fontSize: '0.9em',
  lineHeight: 1.5,
  padding: '10px 15px',
  borderRadius: '8px',
  marginBottom: '12px',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap', // 줄바꿈, 공백 유지

  // ✨ 핵심 변경: 내용만큼 너비를 차지하고 최대 너비 제한
  display: 'inline-flex', // flex 컨테이너로 설정하여 자식 Typography가 내부 공간을 채우게 하고,
                          // 부모(CommentContent의 flex-direction: column) 내에서 내용만큼만 너비 차지
  alignSelf: 'flex-start', // 부모 컬럼 컨테이너 내에서 왼쪽 정렬 (내용만큼만 차지하도록)

  maxWidth: 'calc(100% - 70px)', // 아바타 + 마진 등을 고려한 최대 너비 (조정 필요)
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'calc(100% - 50px)',
  },

  // 말풍선 꼬리 (왼쪽)
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '10px',
    left: '-10px',
    borderTop: '8px solid transparent',
    borderRight: `12px solid ${theme.palette.grey[100]}`,
    borderBottom: '8px solid transparent',
  },
}));

// 댓글 액션 (좋아요 아이콘 및 텍스트)
const CommentActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.85em',
  color: theme.palette.text.secondary,
}));

// ✨ 좋아요 아이콘 버튼 (FaHeart 아이콘을 IconButton으로 감싸기)
const StyledLikeIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary, // 기본 색상
  transition: 'color 0.2s ease, transform 0.2s ease',
  padding: '0.2px', // 패딩 조정
  '&:hover': {
    color: theme.palette.primary.main, // 호버 시 주색상
    backgroundColor: 'transparent', // 배경색 없앰
    transform: 'translateY(-1px)',
  },
}));

// 좋아요 수 텍스트
const LikeCountText = styled(Typography)(props => ({
  fontSize: '0.85em',
  marginLeft: '4px', // 아이콘과 텍스트 사이 간격
  color: props.$isCurrentlyLiked ? '#ff4d4f' : props.theme.palette.text.secondary,
  fontWeight: props.$isCurrentlyLiked ? props.theme.typography.fontWeightBold : props.theme.typography.fontWeightRegular,
  transition: 'color 0.2s ease',
}));

// --- 시간 포맷팅 함수 (외부 import 없음) ---
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return '방금 전';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// --- CommentItem 컴포넌트 ---
function CommentItem({ comment, onLikeToggle, isLoggedIn, onOpenLoginModal }) {
  const { id, nickname, message, createdAt, likesCount, likedByCurrentUser, profileImageUrl } = comment;
  // ✨ isCurrentlyLiked 하나만 사용하도록 통일
  const [currentLikesCount, setCurrentLikesCount] = React.useState(likesCount);
  const [isCurrentlyLiked, setIsCurrentlyLiked] = React.useState(likedByCurrentUser); // 이 상태만 사용합니다.

  // ✨ 불필요한 isLiked 상태 제거
  // const [isLiked, setisLiked] = React.useState(false);

  const displayAuthor = nickname || `사용자 ${id}`;
  const displayTime = formatTimeAgo(createdAt);
  const displayContent = message;

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      onOpenLoginModal();
      return;
    }

    try {
      const response = await api.post(`/comment-like/${id}`);

      const { currentLikesCount: updatedLikesCount, liked: newIsLikedStatus } = response.data.data;

      setCurrentLikesCount(updatedLikesCount);
      setIsCurrentlyLiked(newIsLikedStatus); // ✨ 이 상태를 업데이트합니다.

      if (onLikeToggle) {
        onLikeToggle(id, updatedLikesCount, newIsLikedStatus);
      }

    } catch (error) {
      console.error('댓글 좋아요 토글 실패:', error);
      alert(error.response?.data?.message || '좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <CommentWrapper>
      {profileImageUrl ? (
        <Avatar src={profileImageUrl} alt={`${displayAuthor} 프로필`} sx={{ width: 44, height: 44, marginRight: 1.5 }} />
      ) : (
        <Avatar sx={{ width: 44, height: 44, marginRight: 1.5, bgcolor: 'primary.main', fontWeight: 'bold', fontSize: '1.1em' }}>
          {displayAuthor.charAt(0)}
        </Avatar>
      )}

      <CommentContent>
        <CommentHeader>
          <AuthorName variant='body1'>{displayAuthor}</AuthorName>
          <CommentTime variant='caption'>{displayTime}</CommentTime>
        </CommentHeader>
        <CommentTextBubble>
          <Typography variant='body2' component='p' sx={{ color: 'inherit', lineHeight: 'inherit' }}>
            {displayContent}
          </Typography>
        </CommentTextBubble>
        <CommentActions>
          {/* ✨ 하트 아이콘만 버튼으로 동작 */}
          <StyledLikeIconButton onClick={handleLikeClick} disableRipple>
            {isCurrentlyLiked ? ( // ✨ isCurrentlyLiked 상태를 기반으로 아이콘 렌더링
              <FaHeart style={{ color: '#ff4d4f', fontSize: '0.6em' }} /> // 채워진 빨간 하트
            ) : (
              <FaRegHeart style={{ color: '#999', fontSize: '0.6em' }} /> // 비워진 회색 하트
            )}
          </StyledLikeIconButton>
          {/* ✨ 좋아요 수 텍스트는 버튼 밖에 위치 */}
          <LikeCountText variant='body2' $isCurrentlyLiked={isCurrentlyLiked}>
            {currentLikesCount}
          </LikeCountText>
        </CommentActions>
      </CommentContent>
    </CommentWrapper>
  );
}

export default CommentItem;