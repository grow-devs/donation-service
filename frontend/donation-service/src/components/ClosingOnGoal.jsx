// ClosingOnGoal.jsx
import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, Modal, Backdrop, CircularProgress, Grid } from '@mui/material';
import api from '../apis/api';
import useAuthStore from '../store/authStore';
import LoginForm from '../modal/LoginForm';
import ClosingOnGoalCard from './ClosingOnGoalCard';

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
      <Grid item xs={12} sm={6}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
            width: '100%',
            height: 180,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            p: 2,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              기부율이 가장 높은 게시물 조회
            </Typography>
            <Typography variant="body2" color="text.secondary">
              당신의 따뜻한 마음을 나누어주세요!
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        </Card>
      </Grid>
    );
  }

  if (error || !post) {
    return (
      <Grid item xs={12} sm={6}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
            width: '100%',
            height: 180,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Box sx={{ p: 2, width: '100%' }}>
            <Typography variant="h6" fontWeight={700}>
              기부율이 가장 높은 게시물 조회
            </Typography>
            <Typography variant="body2" color="text.secondary">
              당신의 따뜻한 마음을 나누어주세요!
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography color="text.secondary">
              기부율이 높은 게시물을 찾을 수 없습니다.
            </Typography>
          </Box>
        </Card>
      </Grid>
    );
  }

  return (
    <>
      <Grid item xs={12} sm={6}>
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
      </Grid>
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
