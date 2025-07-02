// RankingCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import ProfileInRankingCard from './ProfileInRankingCard';

const RANKING_DATA = [
  { rank: 1, nickname: '기부천사123', amount: 120000 },
  { rank: 2, nickname: '행복나눔이', amount: 95000 },
  { rank: 3, nickname: '따뜻한손길', amount: 87000 },
  { rank: 4, nickname: '익명의기부자', amount: 50000 },
  { rank: 5, nickname: '희망전도사', amount: 42000 },
];

export default function RankingCard() {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        width: 345,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 헤더 */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          오늘의 기부 랭킹
        </Typography>
        <Typography variant="body2" color="text.secondary">
          지금 이 순간, 가장 따뜻한 사람들
        </Typography>
      </Box>

      {/* 랭킹 리스트 */}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          px: 2,
          pb: 2,
        }}
      >
        {RANKING_DATA.map((user) => (
          <ProfileInRankingCard
            key={user.rank}
            rank={user.rank}
            nickname={user.nickname}
            amount={user.amount}
          />
        ))}
      </CardContent>
    </Card>
  );
}