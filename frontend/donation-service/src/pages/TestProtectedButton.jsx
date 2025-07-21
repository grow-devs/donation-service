import React from 'react';
import { Button, Typography } from '@mui/material';
import api from '../apis/api'

export default function TestProtectedButton() {
  const [response, setResponse] = React.useState('');
  const [error, setError] = React.useState('');

  const handleTestRequest = async () => {
    try {
      const res = await api.get('/user/test');
      setResponse(res.data); // 백엔드에서 "인증 성공!" 이런 메시지를 보내면 표시됨
      setError('');
    } catch (err) {
      setError('❌ 요청 실패: 인증이 필요하거나 토큰이 만료됐습니다.');
      setResponse('');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Button variant="contained" color="primary" onClick={handleTestRequest}>
        /api/user/test 인증 요청
      </Button>

      {response && (
        <Typography variant="body1" color="success.main" mt={2}>
          ✅ 응답: {response}
        </Typography>
      )}

      {error && (
        <Typography variant="body1" color="error" mt={2}>
          {error}
        </Typography>
      )}
    </div>
  );
}
