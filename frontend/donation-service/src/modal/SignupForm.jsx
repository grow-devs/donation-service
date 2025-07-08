// SignupFrom.jsx
import React, { useState } from 'react';
import api from '../apis/api'
import {
  Typography, TextField, Button
} from '@mui/material';
import axios from 'axios';

export default function SignupForm({ onSwitchMode }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    userName: '',
    userRole: 'USER_ROLE',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    try {
      const res = await api.post('/user/signup', form);
      alert(res.data.message || '회원가입 성공');
      onSwitchMode(); // 로그인 모드로 전환
    } catch (err) {
      setError('회원가입 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Typography variant="h5" fontWeight={700} gutterBottom>회원가입</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        필요한 정보를 입력해주세요.
      </Typography>

      <TextField fullWidth label="이메일" name="email" margin="normal"
        value={form.email} onChange={handleChange} />
      <TextField fullWidth label="비밀번호" name="password" type="password" margin="normal"
        value={form.password} onChange={handleChange} />
      <TextField fullWidth label="사용자 이름" name="userName" margin="normal"
        value={form.userName} onChange={handleChange} />
      <TextField fullWidth select SelectProps={{ native: true }}
        label="권한" name="userRole" margin="normal"
        value={form.userRole} onChange={handleChange}>
        <option value="USER_ROLE">USER</option>
        <option value="ADMIN_ROLE">ADMIN</option>
      </TextField>

      {error && <Typography color="error" variant="body2">{error}</Typography>}

      <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleSignup}>가입하기</Button>

      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        mt={2}
        color="text.secondary"
        sx={{ cursor: 'pointer' }}
        onClick={onSwitchMode}
      >
        이미 계정이 있으신가요? 로그인
      </Typography>
    </>
  );
}
