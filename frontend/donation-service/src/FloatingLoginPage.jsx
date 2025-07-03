// FloatingLoginPage.jsx
import React, { useState } from 'react'; 
import { loginApi } from './apis/login';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Fade,
  Backdrop
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const handleLogin = async () => {
    try {
        const data = await loginUser({ email, password });
        localStorage.setItem('accessToken', data.accessToken);
        alert('로그인 성공!');
        onClose(); // 로그인 성공 시 닫기
    } catch (err) {
        console.error(err);
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }   
};


export default function FloatingLoginPage({ open, onClose }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          onClick={(e) => e.stopPropagation()} // 클릭 전파 방지
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
              <Typography variant="h5" fontWeight={700} gutterBottom>
                로그인
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                같이가치에 오신 걸 환영합니다.
              </Typography>

              <TextField
                fullWidth
                label="이메일"
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}

              />
              <TextField
                fullWidth
                label="비밀번호"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                            
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}

                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleLogin}
              
              >
                로그인
                {/* 로그인 api 부르는 onClick() 필요 */}
                
              </Button>

              <Typography
                variant="caption"
                display="block"
                textAlign="center"
                mt={2}
                color="text.secondary"
              >
                아직 계정이 없으신가요? 회원가입
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Backdrop>
  );
}