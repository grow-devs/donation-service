// ParentSummaryCard.jsx
import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import StatCard from './statCard';
import VolunteerActivismSharpIcon from '@mui/icons-material/VolunteerActivismSharp';/**
 * stats: [{ id, label, value }, …]
 */
export default function TodayStats({ stats }) {

  return (
    <Card
      sx={{
        width: 345,                // CampaignCard와 동일 폭
        borderRadius: 3,
        boxShadow: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
     
    >
      {/* Optional: 헤더 */}
      <Box sx={{ p: 2, backgroundColor: 'primary.main', }}>
        
        <Typography variant="subtitle1" fontWeight={500} align="center">
          <VolunteerActivismSharpIcon />
           &nbsp;오늘의 감사한 분들
        </Typography>
       
      </Box>

      {/* 작은 카드 3개 */}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
        }}
      >
        
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </CardContent>
    </Card>
  );
}