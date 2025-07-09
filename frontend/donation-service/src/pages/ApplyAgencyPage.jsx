import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ApplyAgencyPage() {
  const [agencyName, setAgencyName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [nameCheckResult, setNameCheckResult] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ✅ 이름 중복 검사
  const checkDuplicateName = async () => {
    if (!agencyName.trim()) return;

    try {
      console.log('~~~~~ Checking name duplication for:', agencyName);
      const res = await axios.get(`/api/user/team/check-name?name=${agencyName}`);
      if (res.data.isDuplicate) {
        setNameCheckResult({ ok: false, msg: res.data.message });
      } else {
        setNameCheckResult({ ok: true, msg: res.data.message });
      }
    } catch (err) {
      setNameCheckResult({ ok: false, msg: '서버 오류로 중복 확인 실패' });
    }
  };

  // ✅ 등록
  const handleSubmit = async () => {
    if (!agencyName || !address || !description) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    try {
      await axios.post('/api/user/team', {
        name: agencyName,
        address,
        description
      });

      navigate('/mypage'); // 예: 등록 후 마이페이지 이동
    } catch (err) {
      setError('단체 등록에 실패했습니다.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, px: 2 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          후원 단체 등록
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            label="단체 이름"
            fullWidth
            value={agencyName}
            onChange={(e) => {
              setAgencyName(e.target.value);
              setNameCheckResult(null);
            }}
          />
          <Button variant="outlined" onClick={checkDuplicateName} sx={{
            height: 56,
            minWidth: 80, // ← 충분한 너비
            px: 2,        // ← 좌우 여백
            whiteSpace: 'nowrap', // ← 줄바꿈 방지
          }}>
            중복 확인
          </Button>
        </Box>

        {nameCheckResult && (
          <Typography
            sx={{ mt: 1 }}
            color={nameCheckResult.ok ? 'primary' : 'error'}
          >
            {nameCheckResult.msg}
          </Typography>
        )}

        <TextField
          label="주소"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          label="설명"
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          등록하기
        </Button>
      </Paper>
    </Box>
  );
}
