// FloatingAuthModal.jsx
import React, { useState } from 'react';
import { Box, Card, CardContent, Fade, Backdrop } from '@mui/material';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function FloatingAuthModal({ open, onClose }) {
  const [isSignupMode, setIsSignupMode] = useState(false);
  // 모달 영역을 참조할 ref
  const modalRef = React.useRef(null);
  // 클릭이 모달 내부에서 시작됐는지 추적하는 ref
  const mouseDownInsideRef = React.useRef(false);

  // 로그인/회원가입 모드 전환
  const handleModeSwitch = () => setIsSignupMode((prev) => !prev);

  // 마우스를 누른 시점에 모달 내부인지 여부 기록
  const handleMouseDown = (e) => {
    if (modalRef.current?.contains(e.target)) {
      mouseDownInsideRef.current = true; // 모달 내부 클릭
    } else {
      mouseDownInsideRef.current = false; // 모달 외부 클릭
    }
  };

  // 마우스를 떼는 시점에 모달을 닫을지 여부 결정
  const handleBackdropClick = (e) => {
    // 모달 외부에서 mousedown 시작 + mouseup일 경우에만 닫기
    if (!mouseDownInsideRef.current) {
      // 클릭이 모달 내부에서 시작한 것이 아니면 닫기
      onClose();
    }
    // 모달 내부 클릭 후 외부에서 마우스를 떼는 경우는 무시됨
  };

  return (
    <Backdrop
      open={open}
      onMouseDown={handleMouseDown}
      onClick={handleBackdropClick}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
    >
      <Fade in={open}>
        <Box
          ref={modalRef}
          onClick={(e) => e.stopPropagation()} // 안전하게 중복 방지
          sx={{
            width: 360,
            maxWidth: '90%',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <Card>
            <CardContent sx={{ p: 4 }}>
              {isSignupMode ? (
                <SignupForm onSwitchMode={handleModeSwitch} />
              ) : (
                <LoginForm onSwitchMode={handleModeSwitch} onClose={onClose} />
              )}
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Backdrop>
  );
}
