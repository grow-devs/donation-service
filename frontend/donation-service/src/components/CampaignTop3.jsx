// CampaignTop3.jsx
import React, {useEffect, useState} from 'react';
import { Typography, Box, Card, CardContent, Modal, Backdrop} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../apis/api';
import CampaignTop3Card from './CampaignTop3Card';
import LoginForm from '../modal/LoginForm';
import useAuthStore from '../store/authStore';

export default function CampaignTop3() {
  const [topPosts, setTopPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 슬라이드 방향
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useAuthStore(state => state.isLoggedIn);

  // 로그인 모달 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const handleOpenLoginModal = () => setIsLoginModalOpen(true);
  const handleCloseLoginModal = () => setIsLoginModalOpen(false);

  // 게시물 목록과 좋아요 상태를 한 번에 가져오는 함수
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsResponse = await api.get('/post/top3-current-amount');
      const posts = postsResponse.data.data;
      
      const likedStatusPromises = posts.map(async post => {
          try {
              const response = await api.get(`/post-like/check/${post.id}`);
              return response.data.data;
          } catch (error) {
              if (error.response && error.response.status === 403) {
                  console.warn('User is not logged in. Cannot check like status.');
                  return false;
              }
              console.error('Error checking like status:', error);
              return false;
          }
      });

      const likedStatus = await Promise.all(likedStatusPromises);
      
      const postsWithLikeStatus = posts.map((post, index) => ({
        ...post,
        isLiked: likedStatus[index],
      }));
      
      setTopPosts(postsWithLikeStatus);

    } catch (error) {
      console.error('❌ Failed to fetch top 3 posts:', error);
      setTopPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 한 번만 API 호출
  useEffect(() => {
    fetchPosts();
  }, [isAuthenticated]);

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
    <>
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
                initialIsLiked={currentPost.isLiked}
                onLoginRequired={handleOpenLoginModal} // 로그인 모달을 여는 함수 전달
              />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* 로그인 모달 */}
      <Modal
        open={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <LoginForm onClose={handleCloseLoginModal} />
        </Box>
      </Modal>
    </>
  );

}