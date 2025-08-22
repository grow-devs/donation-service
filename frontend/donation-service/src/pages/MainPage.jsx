// MainPage.jsx
import React from "react";
import { Container, Grid } from "@mui/material";
// ↓ 아래 import들은 기존 App.jsx의 내용과 동일
import MainCategory from '../components/MainCategory';
import TotalAmount from '../components/main/right/TotalAmount';
import TimeImpendingCampaign from '../components/main/left/TimeImpendingCampaign';
import CampaignTop3 from '../components/main/left/CampaignTop3';
import ClosingOnGoal from '../components/main/left/ClosingOnGoal';
import TodayStats from '../components/main/right/TodayStats';
import RankingCard from '../components/main/right/RankingCard';

export default function MainPage() {
  const sampleEnd = new Date();
  sampleEnd.setHours(sampleEnd.getHours() + 24);

  const sampleStats = [
    { id: 1, label: "오늘 신규 기부", value: "12건" },
    { id: 2, label: "총 후원자 수", value: "3,245명" },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Grid
        container
        spacing={6}
        alignItems="flex-start"
        justifyContent="center"
        sx={{
          px: {
            xs: 2, // 모바일: 16px
            sm: 5, // 태블릿: 24px
            md: 20, // 데스크톱: 32px
            lg: 28, // 대형 화면: 48px
          },
        }}
      >
        {/* 왼쪽 영역 - 2:1 비율 */}
        <Grid
          size={{ xs: 12, md: 8 }} // 새로운 size prop
          container
          spacing={4}
          direction="column"
        >
          <MainCategory />
          <CampaignTop3 />
          <TimeImpendingCampaign />
          <ClosingOnGoal />
        </Grid>

        {/* 오른쪽 영역 */}
        <Grid
          size={{ xs: 12, md: 4 }} // 새로운 size prop
          container
          spacing={4}
          direction="column"
          alignItems="center"
        >
          <TotalAmount />
          <TodayStats/>
          <RankingCard />
        </Grid>
      </Grid>
    </Container>
  );
}
