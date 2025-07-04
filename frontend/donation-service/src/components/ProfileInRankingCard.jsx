// ProfileInRankingCard.jsx
import React from 'react';
import { Card, Box, Typography } from '@mui/material';

export default function ProfileInRankingCard({ rank, nickname, amount }) {
  return (
    <Card
      elevation={1}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        borderRadius: 2,
        width: '100%',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      }}
    >
      {/* 등수 */}
      <Typography
        variant="subtitle1"
        fontWeight={600}
        color="primary"
        sx={{ minWidth: 32 }}
      >
        {rank}위
      </Typography>

      {/* 닉네임 */}
      <Typography
        variant="body1"
        sx={{
          flexGrow: 1,
          textAlign: 'center',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {nickname}
      </Typography>

      {/* 금액 */}
      <Typography
        variant="subtitle1"
        fontWeight={600}
        color="text.secondary"
        sx={{ minWidth: 80, textAlign: 'right' }}
      >
        {amount.toLocaleString()}원
      </Typography>
    </Card>
  );
}