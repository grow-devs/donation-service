// MainPage.jsx
import React from 'react';
import { Container, Grid } from '@mui/material';
// ↓ 아래 import들은 기존 App.jsx의 내용과 동일
import MainCategory from '../components/MainCategory';
import TotalAmount from '../components/TotalAmount';
import TimeImpendingCampaign from '../components/TimeImpendingCampaign';
import CampaignTop3 from '../components/CampaignTop3';
import ClosingOnGoal from '../components/ClosingOnGoal';
import TodayStats from '../components/TodayStats';
import RankingCard from '../components/RankingCard';

export default function MainPage() {
  const sampleEnd = new Date();
  sampleEnd.setHours(sampleEnd.getHours() + 24);

  const sampleStats = [
    { id: 1, label: '오늘 신규 기부', value: '12건' },
    { id: 2, label: '총 후원자 수', value: '3,245명' },
  ];

  return (
    <Container maxWidth={2000} sx={{ py: 5 }}>
      <Grid container spacing={4} alignItems="flex-start" justifyContent="center" columnSpacing={{ xs: 4, sm: 5, md: 4 }}>
        <Grid item xs={12} sm={6} md={8} container spacing={4} direction="column" justifyContent="center">
          <MainCategory />
          <CampaignTop3 />
          <TimeImpendingCampaign />
          <ClosingOnGoal
            title="마지막 기부자를 찾습니다!"
            endTime={sampleEnd}
            imageUrl="src/assets/react.svg"
            raised={923137}
            goal={1155000}
            onHeart={() => alert('하트 후원!')}
            onDonate={() => alert('기부하기 클릭')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} container spacing={4} direction="column" justifyContent="center" alignItems="center">
          <TotalAmount totalDonation={125000000} />
          <TodayStats stats={sampleStats} />
          <RankingCard />
        </Grid>
      </Grid>
    </Container>
  );
}