// MainPage.jsx
import React from "react";
import { Container, Grid } from "@mui/material";
// ↓ 아래 import들은 기존 App.jsx의 내용과 동일
import MainCategory from "../components/MainCategory";
import TotalAmount from "../components/TotalAmount";
import TimeImpendingCampaignCard from "../components/TimeImpendingCampaignCard";
import CampaignTop3 from "../components/CampaignTop3";
import ClosingOnGoal from "../components/ClosingOnGoal";
import TodayStats from "../components/TodayStats";
import RankingCard from "../components/RankingCard";
import TestProtectedButton from "./TestProtectedButton";
// ... 생략 ...

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
          <TimeImpendingCampaignCard
            title="시간이 얼마 남지 않았어요!"
            endTime={sampleEnd}
            imageUrl="src/assets/react.svg"
            raised={923137}
            goal={1155000}
            onHeart={() => alert("하트 후원!")}
            onDonate={() => alert("기부하기 클릭")}
          />
          <CampaignTop3 />
          <ClosingOnGoal
            title="마지막 기부자를 찾습니다!"
            endTime={sampleEnd}
            imageUrl="src/assets/react.svg"
            raised={923137}
            goal={1155000}
            onHeart={() => alert("하트 후원!")}
            onDonate={() => alert("기부하기 클릭")}
          />
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
