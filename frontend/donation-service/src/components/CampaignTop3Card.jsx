// CampaignTop3Card.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button,
  Grid
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function CampaignTop3Card({
  title,
  imageUrl,
  currentAmount,
  targetAmount,
  deadline,
  percent
}) {

  // 마감일(deadline)과 현재 날짜의 차이를 계산하여 남은 일수 구하기
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 금액을 천 단위로 포맷하는 함수
  const formatAmount = (value) => {
    return value.toLocaleString('ko-KR');
  };

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'row', // 좌우로 나누기 위해 row로 변경
        height: '100%',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}
    >
      {/* 좌측 영역: 썸네일 이미지 */}
      <Box 
        component="img"
        src={imageUrl}
        alt={title}
        sx={{
          width: '40%', // 좌측 영역 40% 할당
          height: '100%',
          objectFit: 'cover', // 이미지가 박스에 맞게 채워지도록
          borderRadius: '8px 0 0 8px', // 좌측 상하단에만 border-radius 적용
        }}
      />
      
      {/* 우측 영역 */}
      <CardContent sx={{ flexGrow: 1, width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          {/* 게시물 제목 */}
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
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
              sx={{ height: 8, borderRadius: 3, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: 'primary.main' } }}
            />
          </Box>

          {/* 금액 및 남은 날짜 */}
          <Grid container alignItems="flex-end" sx={{ mb: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight={600} sx={{ textAlign: 'left' }}>
                {formatAmount(currentAmount)}원
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                {formatAmount(targetAmount)}원
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight={400} sx={{ color: 'primary.main', textAlign: 'left' }}>
                {percent}% 달성
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                {diffDays >= 0 ? `${diffDays}일 남음` : '마감'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* 하트응원 및 기부하기 버튼 */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FavoriteBorderIcon />}
            sx={{ flex: 1, borderColor: 'primary.main', color: 'primary.main' }}
          >
            하트응원
          </Button>
          <Button variant="contained" sx={{ flex: 1 }}>
            기부하기
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}