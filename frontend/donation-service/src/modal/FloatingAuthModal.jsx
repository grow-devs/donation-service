// FloatingAuthModal.jsx
import React, { useState } from 'react';
import { Box, Card, CardContent, Fade, Backdrop } from '@mui/material';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function FloatingAuthModal({ open, onClose }) {
  const [isSignupMode, setIsSignupMode] = useState(false);

  const handleModeSwitch = () => setIsSignupMode((prev) => !prev);

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
      onClick={onClose}
    >
      <Fade in={open}>
        <Box
          onClick={(e) => e.stopPropagation()}
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
