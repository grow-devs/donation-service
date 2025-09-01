// TimeImpendingCampaignCard.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  LinearProgress,
  Snackbar // 알림 메시지(스낵바) 컴포넌트 추가
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import api from '../../../apis/api';
import FavoriteIcon from '@mui/icons-material/Favorite'; // 채워진 하트 아이콘 추가

export default function TimeImpendingCampaignCard({
  postId,
  title,
  endTime,      // Date 객체 또는 타임스탬프
  imageUrl,
  raised,
  goal,
  initialIsLiked,
  onLoginRequired,
}) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isLoggedIn);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // 스낵바 상태
  const [snackbarMessage, setSnackbarMessage] = useState(''); // 스낵바 메시지

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  // 남은 시간을 계산하는 함수 (시:분:초 형식)
  const calcTimeLeft = () => {
    const diff = Math.max(0, new Date(endTime) - new Date());
    const secs = Math.floor(diff / 1000) % 60;
    const mins = Math.floor(diff / 1000 / 60) % 60;
    const hrs  = Math.floor(diff / 1000 / 60 / 60);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  // 달성률 계산
  const percent = Math.min(100, (raised / goal) * 100);

  // 남은 일수를 계산하는 로직
  const today = new Date();
  const deadlineDate = new Date(endTime);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 금액 포맷 함수
  const formatAmount = (value) => {
    return value.toLocaleString('ko-KR');
  };

  // 스낵바 닫기 핸들러
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = () => {
    navigate(`/post-detail/${postId}`);
  };

  // 하트 응원 버튼 클릭 핸들러
  const handleHeartClick = async (event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    
    if (isLiked) {
      setSnackbarMessage('이미 이 게시글에 좋아요를 누르셨습니다.');
      setSnackbarOpen(true);
      return;
    }
      
    try {
      const response = await api.post(`/post-like/${postId}`);
      if (response.status === 200) {
        setIsLiked(true);
        setSnackbarMessage('게시글을 좋아요했습니다!');
        setSnackbarOpen(true);
      }
    } catch (error) {
      if (error.response) {
        const errorResult = error.response.data;
        if (errorResult.message === "POST_LIKE_ALREADY_EXISTS") {
            setIsLiked(true);
            setSnackbarMessage('이미 이 게시글에 좋아요를 누르셨습니다.');
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

  // 기부하기 버튼 클릭 핸들러
  const handleDonateClick = (event) => {
    event.stopPropagation();
    // 상세 페이지로 이동
    navigate(`/post-detail/${postId}`);
  };

  return (
    <>
      <Card
        elevation={1}
        onClick={handleCardClick}
        sx={{
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          cursor: 'default',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
      >
        {/* 좌측 영역: 썸네일 이미지와 오버레이 */}
        <Box 
          sx={{
            position: 'relative',
            width: '40%',
            // height: '100%',
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
          {/* 시간 카운트다운 오버레이 */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              borderRadius: 1,
              px: 1.5,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              typography: 'body1',
              fontWeight: 700
            }}
          >
            {timeLeft}
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
            
            {/* 부제 */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              망설이면 끝! 조금만 더 힘을 보태주세요.
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
                {formatAmount(raised)}원
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatAmount(goal)}원 목표
              </Typography>
            </Box>
            
            {/* 달성률과 남은 일자 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 0.5 }}>
              <Typography variant="body2" fontWeight={400} sx={{ color: 'primary.main' }}>
                {percent.toFixed(0)}% 달성
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
                onClick={handleHeartClick}
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
