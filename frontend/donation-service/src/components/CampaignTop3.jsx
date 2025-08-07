// CampaignTop3.jsx
import React, {useEffect, useState} from 'react';
import { Typography, Box, Card, CardContent} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../apis/api';
import CampaignTop3Card from './CampaignTop3Card';

export default function CampaignTop3() {
  const [topPosts, setTopPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 슬라이드 방향
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 한 번만 API 호출
  useEffect(() => {
    const fetchTop3CurrentAmountPostsWithLikeStatus = async () => {
      setLoading(true);
      try {
        const postsResponse = await api.get('/post/top3-current-amount');
        const posts = postsResponse.data.data;
        
        // 3개의 게시물에 대해 각각 좋아요 상태를 확인하는 API를 호출
        const likedStatusPromises = posts.map(post =>
          api.get(`/post-like/check/${post.id}`)
        );

        const likedStatusResponses = await Promise.all(likedStatusPromises);
        
        // 게시물 데이터와 좋아요 상태 데이터를 병합
        const postsWithLikeStatus = posts.map((post, index) => ({
          ...post,
          isLiked: likedStatusResponses[index].data.data,
        }));
        
        setTopPosts(postsWithLikeStatus);

      } catch (error) {
        console.error('❌ Top 3 기부 게시물 조회 및 좋아요 상태 확인 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTop3CurrentAmountPostsWithLikeStatus();
  }, []);

  // 슬라이드 전환 타이머
  useEffect(() => {
    if (topPosts.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1); // 오른쪽에서 왼쪽으로
      setCurrentIndex((prev) => (prev + 1) % topPosts.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [topPosts]);

  if (loading)
    return <Typography>로딩 중...</Typography>;
  if (topPosts.length === 0) 
    return <Typography>게시물이 없습니다.</Typography>;

  const currentPost = topPosts[currentIndex];

  // currentPost가 없는 경우 렌더링하지 않음
  if (!currentPost) return null;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        maxWidth: 600,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: 340,
        overflow: 'hidden',
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

      <CardContent
        sx={{
          flexGrow: 1,
          px: 2,
          pb: 2,
          position: 'relative',
        }}
      >
        <AnimatePresence custom={direction}>
          <motion.div
            key={currentPost.id}
            custom={direction}
            initial={{ x: direction * 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -300, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', width: '100%' }}
          >
            <CampaignTop3Card
              postId={currentPost.id}
              title={currentPost.title}
              imageUrl={currentPost.imageUrl}
              currentAmount={currentPost.currentAmount}
              targetAmount={currentPost.targetAmount}
              deadline={currentPost.deadline}
              percent={Math.round(
                (currentPost.currentAmount / currentPost.targetAmount) * 100
              )}
              initialIsLiked={currentPost.isLiked} // isLiked 상태를 prop으로 전달
            />
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );

}