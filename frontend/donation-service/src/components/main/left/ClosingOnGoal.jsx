// ClosingOnGoal.jsx
import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, Modal, Backdrop, CircularProgress, Grid } from '@mui/material';
import api from '../../../apis/api';
import useAuthStore from '../../../store/authStore';
import LoginForm from '../../../modal/LoginForm';
import ClosingOnGoalCard from './ClosingOnGoalCard';
import FloatingAuthModal from '../../../modal/FloatingAuthModal';

export default function ClosingOnGoal() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isAuthenticated = useAuthStore(state => state.isLoggedIn);

  // 로그인 모달 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const handleOpenLoginModal = () => setIsLoginModalOpen(true);
  const handleCloseLoginModal = () => setIsLoginModalOpen(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get('/post/top-donation-rate');
        const fetchedPost = response.data.data;
        if (!fetchedPost) {
          throw new Error("No post data found");
        }
        
        // 좋아요 상태 확인 로직 추가
        let isLiked = false;
        if (isAuthenticated) {
            try {
              const likeResponse = await api.get(`/post-like/check/${fetchedPost.id}`);
              isLiked = likeResponse.data.data;
            } catch (likeError) {
              if (likeError.response && likeError.response.status === 403) {
                console.warn('User not logged in, cannot check like status.');
              } else {
                console.error('Error checking like status:', likeError);
              }
            }
        }
        
        setPost({ ...fetchedPost, isLiked });
      } catch (err) {
        console.error('Failed to fetch post with highest donation rate:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 2,
          // maxWidth: 600,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: 340,
          overflow: 'hidden',
          p: 2,
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            목표 달성에 가까워졌어요!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            당신의 마음을 더해주세요.
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error || !post) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 2,
          // maxWidth: 600,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 340,
          p: 2,
        }}
      >
        <Box sx={{ p: 2, width: '100%' }}>
          <Typography variant="h6" fontWeight={700}>
            목표 달성에 가까워졌어요!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            당신의 마음을 더해주세요.
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography color="text.secondary">
            목표 달성에 가까워진 게시물을 찾을 수 없습니다.
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <>
     <Card
             sx={{
               borderRadius: 3,
               boxShadow: 2,
               // maxWidth: 600,
               width: '100%',
               display: 'flex',
               flexDirection: 'column',
               height: '100%',
               overflow: 'hidden',
             }}
           >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            목표 달성에 가까워졌어요!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            당신의 마음을 더해주세요.
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, px: 2, pb: 2, pt: 0 }}>
          <ClosingOnGoalCard
            postId={post.id}
            title={post.title}
            endTime={post.deadline}
            imageUrl={post.imageUrl}
            raised={post.currentAmount}
            goal={post.targetAmount}
            initialIsLiked={post.isLiked}
            onLoginRequired={handleOpenLoginModal}
          />
        </Box>
      </Card>

      {/* 로그인 모달 */}
      <FloatingAuthModal
        open={isLoginModalOpen}
        onClose={handleCloseLoginModal}
      />
    </>
  );
}