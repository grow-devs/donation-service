import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Fade, Backdrop, Snackbar, Alert,
} from '@mui/material';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function FloatingAuthModal({ open, onClose }) {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const modalRef = useRef(null);
  const mouseDownInsideRef = useRef(false);

  // ✨ 스낵바 상태 관리
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success', 'error', 'warning', 'info'
  });

  // ✨ 로그인/회원가입 모드 전환 핸들러
  const handleModeSwitch = (mode) => {
    setIsSignupMode(mode === 'signup');
  };

  // 마우스 클릭이 모달 내부에서 시작되었는지 추적
  const handleMouseDown = (e) => {
    mouseDownInsideRef.current = modalRef.current?.contains(e.target);
  };

  // 모달 외부 클릭 시 모달 닫기
  const handleBackdropClick = (e) => {
    if (!mouseDownInsideRef.current) {
      onClose();
    }
  };

  // ✨ 스낵바를 띄우는 함수 (자식 컴포넌트에 전달)
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // ✨ 스낵바 닫기 핸들러
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Backdrop
        open={open}
        onMouseDown={handleMouseDown}
        onClick={handleBackdropClick}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={open}>
          <Box
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: 400,
              maxWidth: '90%',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 6,
            }}
          >
            <Card>
              <CardContent sx={{ p: 4 }}>
                {isSignupMode ? (
                  // ✨ SignupForm에 onShowSnackbar prop 전달
                  <SignupForm onSwitchMode={handleModeSwitch} onShowSnackbar={showSnackbar} />
                ) : (
                  // ✨ LoginForm에 onShowSnackbar prop 전달
                  <LoginForm onSwitchMode={handleModeSwitch} onClose={onClose} onShowSnackbar={showSnackbar} />
                )}
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Backdrop>

      {/* ✨ Snackbar 컴포넌트 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}