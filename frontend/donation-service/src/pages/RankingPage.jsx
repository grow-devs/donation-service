// src/RankingPage.jsx

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import RankingCard from '../components/RankingCard';

export default function RankingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',           // 화면 전체 높이
        display: 'flex',              // 가운데 정렬 위해 flex 사용
        alignItems: 'center',         // 수직 가운데
        justifyContent: 'center',     // 수평 가운데
        backgroundColor: '#f9f9f9',   // 배경색 (선택)
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          🏆 오늘의 기부 랭킹
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          지금 이 순간, 가장 따뜻한 사람들을 만나보세요.
        </Typography>
        <RankingCard />
      </Container>
    </Box>
  );
}
