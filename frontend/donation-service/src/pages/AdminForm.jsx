// src/pages/AdminForm.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
} from '@mui/material';
import api from '../apis/api';

export default function AdminForm() {

  const [agencyRequests, setAgencyRequests] = useState([]); // 실제 API에서 불러온 데이터
  const [postRequests, setPostRequests] = useState([]); // 게시물 신청 리스트 상태 추가

  useEffect(() => {
    const fetchAgencyList = async () => {
      try {
        const res = await api.get('/admin/team-list');
        setAgencyRequests(res.data.data || []);
        console.log('~~~ res.data.data : ', res.data.data);
      } catch (err) {
        console.error('단체 신청 리스트 불러오기 실패:', err);
      }
    };

    fetchAgencyList();
  }, []);

  useEffect(() => {
    const fetchPostList = async () => {
      try {
        const res = await api.get('/admin/post-list', {
          params: {
            page: 0,
            size: 10,
            sort: 'updatedAt,desc', // 또는 'createdAt,desc'로 맞춰도 됨
          },
        });
        setPostRequests(res.data.data?.content || []);
      } catch (err) {
        console.error('게시물 리스트 불러오기 실패', err);
      }
    };
    fetchPostList();
  }, []);
  

  const handleApproval = async (teamId, status) => {
    try {
      await api.patch(`/admin/team-approval/${teamId}`, status, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // 승인 or 거절 후 목록 새로고침
      const res = await api.get('/admin/team-list');
      setAgencyRequests(res.data.data || []);
    } catch (err) {
      console.error('팀 승인 상태 변경 실패:', err);
    }
  };

  return (
    <Box
      sx={{
        width: '70%',
        margin: '0 auto',
        mt: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      }}
    >
      {/* 단체 신청 리스트 */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          단체 신청 리스트
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>날짜</TableCell>
              <TableCell>단체 이름</TableCell>
              <TableCell align="right">설명</TableCell>
              <TableCell align="right">상태1</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agencyRequests.map((req, index) => (
              <TableRow key={index}>
                <TableCell>{req.createdAt ? req.createdAt.substring(0, 16).replace('T', ' \u00A0\u00A0') : '-'}</TableCell>
                <TableCell>{req.name}</TableCell>
                <TableCell align="right">{req.description}</TableCell>
                <TableCell align="right">
                  {req.approvalStatus === 'PENDING' && (
                    <>
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        sx={{ mx: 0.5 }}
                        onClick={() => handleApproval(req.teamId, 'ACCEPTED')}
                      >
                        수락
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ mx: 0.5 }}
                        onClick={() => handleApproval(req.teamId, 'REJECTED')}
                      >
                        거절
                      </Button>
                    </>
                  )}
                  {req.approvalStatus === 'ACCEPTED' && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        mx: 0.5,
                        backgroundColor: '#4caf50', // 초록
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#388e3c', // 진한 초록
                        },
                      }}
                    >
                      수락됨
                    </Button>
                  )}
                  {req.approvalStatus === 'REJECTED' && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        mx: 0.5,
                        backgroundColor: '#f44336', // 빨강
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#d32f2f', // 진한 빨강
                        },
                      }}
                    >
                      거절됨
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Paper>

      {/* 게시물 신청 리스트 */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          게시물 신청 리스트
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>날짜</TableCell>
              <TableCell>단체 이름</TableCell>
              <TableCell>게시물 제목</TableCell>
              <TableCell>카테고리</TableCell>
              <TableCell align="right">처리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postRequests.map((post, index) => (
              <TableRow key={index}>
                <TableCell>{post.createdAt ? post.createdAt.substring(0, 16).replace('T', ' \u00A0\u00A0') : '-'}</TableCell>
                <TableCell>{post.teamName}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.categoryName}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" color="success" size="small" 
                    sx={{
                            px: 1,              // 좌우 padding (1 = 8px)
                            py: 1.5,              // 상하 padding
                            fontSize: '0.9rem',   // 텍스트 크기
                            minWidth: 'auto',     // 최소 너비 제거
                            height: '24px',       // 버튼 높이 (원하는 값으로 조정 가능)
                            lineHeight: 1,        // 줄간격 조정
                            }}
                            >
                        수락
                  </Button>
                  <Button variant="outlined" color="error"
                    sx={{
                        px: 1,              // 좌우 padding (1 = 8px)
                        py: 1.5,              // 상하 padding
                        fontSize: '0.9rem',   // 텍스트 크기
                        minWidth: 'auto',     // 최소 너비 제거
                        height: '24px',       // 버튼 높이 (원하는 값으로 조정 가능)
                        lineHeight: 1,        // 줄간격 조정
                        }}
                        >
                    거절
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}