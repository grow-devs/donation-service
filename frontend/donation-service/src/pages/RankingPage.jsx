// - 실제 API에서 ?page=2 같은 방식으로 데이터 받아오기
// - 로딩 스피너 추가
// - “내 순위 보기” 버튼 추가

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Button,
} from '@mui/material';
import { useState } from 'react';

const mockRankingData = [
  { id: 1, name: '김가치', points: 1520, avatar: '/avatars/1.png' },
  { id: 2, name: '박나눔', points: 1380, avatar: '/avatars/2.png' },
  { id: 3, name: '이도움', points: 1275, avatar: '/avatars/3.png' },
  { id: 4, name: '최기부', points: 1190, avatar: '/avatars/4.png' },
  { id: 5, name: '정참여', points: 1105, avatar: '/avatars/5.png' },
  { id: 6, name: '한기여', points: 1040, avatar: '/avatars/6.png' },
  { id: 7, name: '윤공유', points: 980, avatar: '/avatars/7.png' },
  { id: 8, name: '장나눔', points: 940, avatar: '/avatars/8.png' },
  { id: 9, name: '오기부', points: 910, avatar: '/avatars/9.png' },
  { id: 10, name: '백참여', points: 880, avatar: '/avatars/10.png' },
];

export default function RankingPage() {
  const [visibleCount, setVisibleCount] = useState(5);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const visibleUsers = mockRankingData.slice(0, visibleCount);
  const hasMore = visibleCount < mockRankingData.length;

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        🏆 기부 랭킹
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        가장 많은 기부를 실천한 사용자들을 소개합니다.
      </Typography>

      <Stack spacing={2}>
        {visibleUsers.map((user, index) => (
          <Card key={user.id} sx={{ borderLeft: '6px solid #ffb64d' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ width: 40, textAlign: 'center', color: '#ffb64d' }}
              >
                {index + 1}
              </Typography>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ width: 56, height: 56, mx: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.points.toLocaleString()} 포인트
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {hasMore && (
        <Box textAlign="center" mt={4}>
          <Button variant="outlined" onClick={handleShowMore}>
            더보기
          </Button>
        </Box>
      )}
    </Container>
  );
}