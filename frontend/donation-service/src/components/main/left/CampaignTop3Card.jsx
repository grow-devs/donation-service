// CampaignTop3Card.jsx
import React, {useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button,
  Snackbar, // 알림 메시지(스낵바) 컴포넌트 추가
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite'; // 채워진 하트 아이콘 추가
import api from '../../../apis/api';
import useAuthStore from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function CampaignTop3Card({
  postId,
  title,
  imageUrl,
  currentAmount,
  targetAmount,
  deadline,
  percent,
  initialIsLiked,
  onLoginRequired
}) {
  const navigate = useNavigate();  // 네비게이트 함수

  // 게시물 좋아요 상태를 관리하는 state
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const isAuthenticated = useAuthStore(state => state.isLoggedIn); // 로그인 상태를 확인하는 코드

  // 스낵바 상태 관리
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);
  // 참고로 여기선 좋아요 수는 표시하지 않는다.

  // 마감일(deadline)과 현재 날짜의 차이를 계산하여 남은 일수 구하기
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 금액을 천 단위로 포맷하는 함수
  const formatAmount = (value) => {
    return value.toLocaleString('ko-KR');
  };

  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = () => {
    navigate(`/post-detail/${postId}`);
  };

  // 스낵바 닫기 핸들러
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // '하트응원' 버튼 클릭 시 좋아요 API 호출
  const handleLikeClick = async (event) => {
    event.stopPropagation();  // 중요! 카드 클릭 이벤트로 이어지지 않게 막음
    // 1. 로그인 상태가 아니면 로그인 모달을 띄우고 함수 종료
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
  
    // 2. 로그인된 상태이고, 이미 좋아요를 눌렀다면 아무 동작도 하지 않음.
    if (isLiked) {
      setSnackbarMessage('이미 좋아요를 누르셨습니다.');
      setSnackbarOpen(true);
      return;
    }
    
    try {
      // 좋아요 API 호출
      const response = await api.post(`/post-like/${postId}`);
      if (response.status === 200) {
        setIsLiked(true); // 좋아요 성공 시 isLiked 상태를 true로 변경
        setSnackbarMessage("게시글을 좋아요했습니다!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      if (error.response) {
        const errorResult = error.response.data;
        // 이미 좋아요를 누른 경우
        if (errorResult.message === "POST_LIKE_ALREADY_EXISTS") {
            setIsLiked(true); // 혹시 모를 상황에 대비하여 isLiked를 true로 강제 설정
            setSnackbarMessage("이미 이 게시글에 좋아요를 누르셨습니다.");
            setSnackbarOpen(true);
        } else {
          setSnackbarMessage(`좋아요 처리 중 오류 발생: ${errorResult.message || '알 수 없는 오류'}`);
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarMessage("네트워크 오류: 서버에 연결할 수 없습니다.");
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <>
      <Card
        elevation={1}
        onClick={handleCardClick}
        sx={{
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'row', // 좌우로 나누기 위해 row로 변경
          height: '100%',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          cursor: 'default',  // 기본은 화살표
          '&:hover': {
            cursor: 'pointer',  // 호버 시 손가락
          },
          
        }}
      >
        {/* 좌측 영역: 썸네일 이미지 */}
        <Box 
          sx={{
            position: 'relative',
            width: '40%',
            height: '100%',
            borderRadius: '8px 0 0 8px',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          {/* '종료임박' 배지 */}
          <Box 
            sx={{ 
              position: 'absolute',
              bottom: 8,
              left: 8,
              bgcolor: 'error.main',
              color: 'white',
              borderRadius: '16px',
              px: 1.5,
              py: 0.5,
              typography: 'caption',
              fontWeight: 500,
            }}
          >
            종료임박
          </Box>
        </Box>
        
        {/* 우측 영역 */}
        <CardContent sx={{ flexGrow: 1, width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            {/* 게시물 제목 */}
            <Typography
              variant="h6"
              fontWeight={600}
              noWrap
              sx={{ mb: 1 }}
            >
              {title}
            </Typography>

            {/* 진행률 바 */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{ height: 8, borderRadius: 3, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#fc7979' } }}
              />
            </Box>

            {/* 금액 정보 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                {formatAmount(currentAmount)}원
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatAmount(targetAmount)}원 목표
              </Typography>
            </Box>
            
            {/* 달성률과 남은 일자 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 0.5 }}>
              <Typography variant="body2" fontWeight={400} sx={{ color: 'primary.main' }}>
                {percent}% 달성
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {diffDays >= 0 ? `${diffDays}일 남음` : '마감'}
              </Typography>
            </Box>
          </Box>

          {/* 하트응원 및 기부하기 버튼 */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleLikeClick} // onClick 이벤트 핸들러 추가
              fullWidth
            >
              {/* 좋아요 상태에 따라 다른 아이콘 렌더링 */}
              {isLiked ? (
                <FavoriteIcon sx={{ color: '#f04646', mr: 1 }} />
              ) : (
                <FavoriteBorderIcon sx={{ mr: 1 }} />
              )}
              <Typography variant="body2">하트응원</Typography>
            </Button>
            <Button variant="outlined" fullWidth
              sx={{
                backgroundColor: '#ffffff', // 버튼 배경 흰색
                color: '#000000',           // 글자 검은색
                borderColor: '#595959',     // 테두리 검정
                '&:hover': {
                  backgroundColor: '#f0f0f0', // 호버 시 연한 회색 배경
                  borderColor: '#595959',      // 호버 시 테두리 검정 유지
                },
                boxShadow: 'none',           // 입체감 제거
              }}>
              기부하기
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 스낵바 컴포넌트 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // 3초 후에 자동으로 닫힘
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // 화면 하단 중앙에 표시
      />

    </>
  );
}