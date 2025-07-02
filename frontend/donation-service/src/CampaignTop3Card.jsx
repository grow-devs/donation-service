// CampaignTop3Card.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress
} from '@mui/material';

export default function CampaignTop3Card({
  title,
  organization,
  amount,
  percent
}) {
  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',        // 부모 그리드 셀 높이에 맞춤
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* 1. 제목 */}
        <Typography
          variant="subtitle1"
          fontWeight={400}
          gutterBottom
          noWrap
        >
          {title}
        </Typography>
        {/* 2. 기관명 */}
        <Typography variant="caption" color="text.secondary" noWrap>
          {organization}
        </Typography>

        {/* 3. 진행률 바 */}
        <Box sx={{ mt: 1}}>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        {/* 4. 기부금액 & 달성률 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mt: 1
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {percent}% 달성
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {amount}원
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}