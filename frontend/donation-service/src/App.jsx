import * as React from 'react'
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MainAppBar from './MainAppBar'
import MainCategory from './MainCategory'
import TotalAmount from './TotalAmount'
import TimeImpendingCampaignCard from './TimeImpendingCampaignCard';
import ClosingOnGoal from './ClosingOnGoal'
import CampaignTop3 from './CampaignTop3'
import TodayStats from './TodayStats'
import RankingCard from './RankingCard';

import { Button,Grid,Card,CardContent,Container,Stack,Typography } from '@mui/material';

function App() {
  const [value, setValue] = React.useState(0);
  const sampleEnd = new Date();
  sampleEnd.setHours(sampleEnd.getHours() + 24); // 24시간 뒤
  const sampleStats = [
    { id: 1, label: '오늘 신규 기부', value: '12건' },
    { id: 2, label: '총 후원자 수', value: '3,245명' }
  ];

  

  return (

    <Container maxWidth={300} sx={{ py: 5 ,md:'auto'}}>
      <Grid container spacing={4} alignItems="flex-start" justifyContent="center"  columnSpacing={{ xs: 4, sm: 5, md: 10 }} // 가로축 중앙 정렬
>
        {/* 왼쪽 메인(1번 컬럼) */}
        <Grid
          item
          xs={12}      // 모바일엔 100%
          sm={6}       // sm 이상엔 50%
          md={8}       // md 이상엔 8/12 (≈ 66.6%)
          container spacing={4} direction="column" justifyContent="center"  alignItems="scretch"     // ← 가로축 중앙 정렬
>
        <MainCategory />

          <TimeImpendingCampaignCard
            title="시간이 얼마 남지 않았어요!"
            endTime={sampleEnd}
            imageUrl="src\assets\react.svg"
            raised={923137}
            goal={1155000}
            onHeart={() => alert('하트 후원!')}
            onDonate={() => alert('기부하기 클릭')}
          />

          <CampaignTop3 />     
          <ClosingOnGoal
            title="마지막 기부자를 찾습니다!"
            endTime={sampleEnd}
            imageUrl="src\assets\react.svg"
            raised={923137}
            goal={1155000}
            onHeart={() => alert('하트 후원!')}
            onDonate={() => alert('기부하기 클릭')}
          />
          
        </Grid>

        {/* 오른쪽 사이드(2번 컬럼) */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          // md 이상엔 4/12 (≈ 33.3%) 
          container spacing={4}
          direction="column"
          justifyContent="center"
          alignItems="center">    { /*// ← 가로축 중앙 정렬*/}
          <TotalAmount totalDonation={125000000} />
     
          <TodayStats stats={sampleStats}/>

          <RankingCard/>
        </Grid>
      </Grid>
    </Container>


    
    
  )
}

export default App
