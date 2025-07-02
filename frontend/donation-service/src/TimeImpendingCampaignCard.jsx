// CampaignCard.jsx
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function TimeImpendingCampaignCard({
  title,
  endTime,      // Date 객체 또는 타임스탬프
  imageUrl,
  raised,
  goal,
  onHeart,
  onDonate,
}) {
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

  const percent = Math.min(100, (raised / goal) * 100);

  return (
    <Card
      sx={{
        width: '100%',   
        borderRadius: 3,
        boxShadow: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. 헤더: 제목 + 카운트다운 + 종료 임박 버튼 */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
          <Typography variant="subtitle2" fontWeight={300}>
          망설이면 끝! 조금만 더 힘을 보태주세요.
        </Typography>
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon color="action" fontSize="small" />
          <Typography
            variant="body2"
            color={timeLeft === '00:00:00' ? 'error' : 'text.secondary'}
          >
            {timeLeft}
          </Typography>
          <Button
            size="small"
            color="error"
            variant="contained"
            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
          >
            종료임박
          </Button>
        </Box>
      </Box>

      {/* 2. 대표 이미지 */}
      <CardMedia
        component="img"
        height="180"
        image={imageUrl}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />

      {/* 3. 진행률 표시 */}
      <CardContent sx={{ pt: 2, px: 2 }}>
        <Box sx={{ mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {`${percent.toFixed(0)}% 달성 (${raised.toLocaleString()}원 / ${goal.toLocaleString()}원)`}
        </Typography>
      </CardContent>

      {/* 4. 버튼 그룹 */}
      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 1,
          display: 'flex',
          gap: 1,
        }}
      >
        <Button
          startIcon={<FavoriteBorderIcon />}
          variant="outlined"
          fullWidth
          onClick={onHeart}
        >
          하트후원
        </Button>
        <Button variant="contained" fullWidth onClick={onDonate}>
          기부하기
        </Button>
      </Box>
    </Card>
  );
}