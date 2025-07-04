// CampaignTop3.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
    Grid,
  Box
} from '@mui/material';
import CampaignTop3Card from './CampaignTop3Card';

const MOST_DONATED = [
  {
    id: 1,
    title: '숨결로 그린 이야기, 결핵을 만나다',
    organization: '한국결핵환우회(KPDS)',
    amount: 2_444_900,
    percent: 62
  },
  {
    id: 2,
    title: '눈앞에 다가온 기후위기, 지구와 환자를 함께 치유해요',
    organization: '국경없는의사회 한국',
    amount: 1_931_847,
    percent: 20
  },
  {
    id: 3,
    title: '서로의 눈과 손이 되어',
    organization: 'EBS나눔0700 위원회',
    amount: 3_314_307,
    percent: 14
  },
  {
    id: 4,
    title: '독거노인 도움회',
    organization: 'EBS나눔0700 위원회',
    amount: 3_314_307,
    percent: 14
  }
];

export default function CampaignTop3() {
  return (
      <Card
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        maxWidth: 600, 
        width: '100%',            // 부모 카드 폭 고정
        display: 'flex',
        flexDirection: 'column',
        height: 300,            // 부모 카드 높이 고정
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          가장 많이 기부 중인 모금함
        </Typography>
        <Typography variant="body2" color="text.secondary">
          오늘, 기부 하셨나요? 당신의 마음도 함께 나눠주세요!
        </Typography>
      </Box>

      {/* ─── 스크롤 영역 ─── */}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          overflowX: 'auto',
          px: 2,
          pb: 2,
        }}
      >
       {MOST_DONATED.map(item => (
          <Box
            key={item.id}
            sx={{
              flex: '0 0 33.333%', // 3개가 부모 폭의 1/3씩 차지
              minWidth: 0,         // 자식 내부 텍스트 래핑을 막기 위함
            }}
          >
            <CampaignTop3Card {...item} />
          </Box>
        ))}

      </CardContent>
    </Card>

  );
}