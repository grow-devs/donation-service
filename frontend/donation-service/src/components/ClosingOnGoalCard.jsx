// ClosingOnGoalCard.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Button,
  LinearProgress,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../apis/api';

export default function ClosingOnGoalCard({
  postId,
  title,
  endTime,
  imageUrl,
  raised,
  goal,
  initialIsLiked,
  onLoginRequired,
}) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isLoggedIn);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  // 달성률 계산
  const percent = Math.min(100, (raised / goal) * 100);
  const remaining = Math.max(0, goal - raised);

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
      alert('이미 좋아요를 누르셨습니다.');
      return;
    }
      
    try {
      const response = await api.post(`/post-like/${postId}`);
      if (response.status === 200) {
        setIsLiked(true);
        alert("게시글을 좋아요했습니다!");
      }
    } catch (error) {
      if (error.response) {
        const errorResult = error.response.data;
        if (errorResult.message === "POST_LIKE_ALREADY_EXISTS") {
            alert("이미 이 게시글에 좋아요를 누르셨습니다.");
            setIsLiked(true);
        } else {
            alert(`좋아요 처리 중 오류 발생: ${errorResult.message || '알 수 없는 오류'}`);
        }
      } else {
        alert("네트워크 오류: 서버에 연결할 수 없습니다.");
      }
    }
  };

  // 기부하기 버튼 클릭 핸들러
  const handleDonateClick = (event) => {
    event.stopPropagation();
    // 상세 페이지로 이동하도록 수정
    navigate(`/post-detail/${postId}`);
  };

  return (
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
        
        {/* 남은 금액 오버레이 */}
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
            typography: 'body1',
            fontWeight: 700,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="caption" fontWeight={400} sx={{ lineHeight: 1 }}>
            남은 금액
          </Typography>
          <Typography variant="body1" fontWeight={700}>
            {remaining.toLocaleString()}원
          </Typography>
        </Box>
      </Box>
      
      {/* 우측 영역 */}
      <CardContent sx={{ flexGrow: 1, width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          {/* 게시물 제목 */}
          <Typography
            variant="h6"
            fontWeight={400}
            noWrap
            sx={{ mb: 1 }}
          >
            {title}
          </Typography>
          
          {/* 부제 */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            목표까지 얼마 남지 않았습니다.
          </Typography>

          {/* 진행률 바 */}
          <Box sx={{ mt: 2, mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{ height: 8, borderRadius: 3, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: 'primary.main' } }}
            />
          </Box>

          {/* 금액 정보 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1 }}>
            <Typography variant="body1" fontWeight={600}>
              {raised.toLocaleString()}원
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {goal.toLocaleString()}원 목표
            </Typography>
          </Box>
          
          {/* 달성률 */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 0.5 }}>
            <Typography variant="body2" fontWeight={400} sx={{ color: 'primary.main' }}>
              {percent.toFixed(0)}% 달성
            </Typography>
          </Box>
        </Box>

        {/* 하트응원 및 기부하기 버튼 */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            startIcon={<FavoriteBorderIcon />}
            variant="outlined"
            fullWidth
            onClick={handleHeartClick}
            disabled={isLiked}
          >
            하트응원
          </Button>
          <Button variant="contained" fullWidth onClick={handleDonateClick}>
            기부하기
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
