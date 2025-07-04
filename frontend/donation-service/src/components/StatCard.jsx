// StatCard.jsx
import React from 'react';
import { Card, Box, Typography } from '@mui/material';

/**
 * 작은 카드: 왼쪽에 label, 오른쪽에 value
 */
export default function StatCard({ label, value }) {
  return (
    <Card
      elevation={1}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        {value}
      </Typography>
    </Card>
  );
}