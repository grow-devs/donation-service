// LoginFrom.jsx
import React, { useState } from 'react';
import {
  Typography, TextField, Button, IconButton, InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../apis/api'

export default function LoginForm({ onSwitchMode, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/user/login', { email, password });
      const accessToken= res.data.data;  // 객체에서 분해 할당
      localStorage.setItem('accessToken', accessToken);
      alert('로그인 성공');
      onClose();
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <>
      <Typography variant="h5" fontWeight={700} gutterBottom>로그인</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        같이가치에 오신 걸 환영합니다.
      </Typography>

      <TextField fullWidth label="이메일" type="email" margin="normal"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth label="비밀번호" type={showPassword ? 'text' : 'password'} margin="normal"
        value={password} onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {error && <Typography color="error" variant="body2">{error}</Typography>}

      <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleLogin}>로그인</Button>

      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        mt={2}
        color="text.secondary"
        sx={{ cursor: 'pointer' }}
        onClick={onSwitchMode}
      >
        아직 계정이 없으신가요? 회원가입
      </Typography>
    </>
  );
}
