import React, { useState } from 'react';
import { 
  Box, 
  Avatar, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab,
  Button 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {
  const [tab, setTab] = useState(0);

  const navigate = useNavigate();
  const [sponsorAgencyName, setSponsorAgencyName] = useState(null); // 예시: null이면 미가입 상태

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: 550
    , mx: 'auto', mt: 4, px: 1 }}>
      {/* 프로필 */}
      <Card sx={{ mb: 3 ,boxShadow: '0 4px 12px rgba(0,0,0,0.12)',}} >
        <CardContent>
          {/* 상단: 프로필 + 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 70, height: 70, mr: 2 }} src="/profile.jpg" />
              <Box>
                <Typography variant="h6">홍길동</Typography>
                <Typography variant="body2" color="text.secondary">
                  나눔을 실천하는 회원입니다.
                </Typography>
              </Box>
            </Box>

          </Box>

          <Box sx={{ mt: 2 }}>
            {/* 첫 줄: '후원 단체' 텍스트 + 버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                후원 단체
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/apply-agency')}
                sx={{ height: 30 }}
              >
                {sponsorAgencyName ? '변경' : '등록'}
              </Button>
            </Box>

            {/* 둘째 줄: 실제 단체 이름 or 없음 */}
            <Typography variant="body1" fontWeight="bold" sx={{ mt: 0.5 }}>
              {sponsorAgencyName ? sponsorAgencyName : '없음'}
            </Typography>
          </Box>
        </CardContent>

        {/* <CardContent sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          <Avatar sx={{ width: 70, height: 70, mr: 2 }} src="/profile.jpg" />
          <Box>
            <Typography variant="h6">홍길동</Typography>
            <Typography variant="body2" color="text.secondary">나눔을 실천하는 회원입니다.</Typography>
          </Box>
        </CardContent> */}
        
      </Card>

      {/* 기부내역 */}
      <Card sx={{ mb: 3 ,boxShadow: '0 4px 12px rgba(0,0,0,0.12)',}}  >
        <CardContent sx={{ py: 2 }}>
          <Typography variant="h5" sx={{ mb: 1 ,fontWeight: 'bold' }}>
            기부내역
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center',}}>
            {/* 왼쪽: 총 기부금 */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                총 기부금
              </Typography>
              <Typography variant="h6" sx={{ }}>
                150,000원
              </Typography>
            </Box>

            {/* 오른쪽: 참여한 캠페인 / 기부 횟수 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary"  align="center">
                  참여한 캠페인
                </Typography>
                <Typography variant="subtitle1" align="center">5건</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary"  align="center">
                  총 기부 횟수
                </Typography>
                <Typography variant="subtitle1" align="center">12회</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 활동 요약 */}
      

      {/* 탭 */}
      <Box>
        <Tabs value={tab} onChange={handleChange} centered size="small">
          <Tab label="기부 내역" />
          <Tab label="참여 내역" />
        </Tabs>
        <Box sx={{ mt: 1 }}>
          {tab === 0 && (
            <Card sx={{ p: 1,boxShadow: '0 4px 12px rgba(0,0,0,0.12)', }} variant="outlined">
              <Typography variant="body2">기부 내역 상세를 불러오는 영역입니다.</Typography>
            </Card>
          )}
          {tab === 1 && (
            <Card sx={{ p: 1 ,boxShadow: '0 4px 12px rgba(0,0,0,0.12)',}} variant="outlined">
              <Typography variant="body2">참여 내역 상세를 불러오는 영역입니다.</Typography>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
}
