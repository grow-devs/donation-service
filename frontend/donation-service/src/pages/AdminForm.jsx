// src/pages/AdminForm.jsx
import React from 'react';
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

export default function AdminForm() {
  // 샘플 데이터
  const agencyRequests = [
    { date: '2025-07-10', name: '희망나눔회', status: 'pending' },
    { date: '2025-07-09', name: '행복한세상재단', status: '수락됨' },
    { date: '2025-07-08', name: '기부천사들', status: '거절됨' },
    // ... (최대 6개)
  ];

  const postRequests = [
    {
      date: '2025-07-10',
      agency: '희망나눔회',
      title: '소외된 이웃을 위한 여름나기',
      category: '복지',
      status: 'pending',
    },
    {
      date: '2025-07-09',
      agency: '행복한세상재단',
      title: '청소년 장학금 캠페인',
      category: '교육',
      status: '수락됨',
    },
    {
        date: '2025-07-09',
        agency: '행복한세상재단',
        title: '청소년 장학금 캠페인',
        category: '교육',
        status: '수락됨',
      },
    // ... (최대 6개)
  ];

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
              <TableCell align="right">처리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agencyRequests.map((req, index) => (
              <TableRow key={index}>
                <TableCell>{req.date}</TableCell>
                <TableCell>{req.name}</TableCell>
                <TableCell align="right">
                <Button
                    variant="outlined"
                    color="success"
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
                  <Button 
                    variant="outlined"
                    color="error"
                    sx={{
                            px: 1,              // 좌우 padding (1 = 8px)
                            py: 1.5,              // 상하 padding
                            fontSize: '0.9rem',   // 텍스트 크기
                            minWidth: 'auto',     // 최소 너비 제거
                            height: '24px',       // 버튼 높이 (원하는 값으로 조정 가능)
                            lineHeight: 1,        // 줄간격 조정
                        }}>
                        거절
                  </Button>
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
                <TableCell>{post.date}</TableCell>
                <TableCell>{post.agency}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
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