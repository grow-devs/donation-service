// src/pages/AdminForm.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Tabs, Tab,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Pagination,
  Stack,
  PaginationItem,
} from '@mui/material';
import api from '../apis/api';

export default function AdminForm() {
  const [tabIndex, setTabIndex] = useState(0); // 0: 단체, 1: 게시물
  const [agencyRequests, setAgencyRequests] = useState([]);
  const [postRequests, setPostRequests] = useState([]);

  const [agencyCurrentPage, setAgencyCurrentPage] = useState(0); // 단체 현재 페이지 (0부터 시작)
  const [agencyTotalPages, setAgencyTotalPages] = useState(0); // 단체 전체 페이지 수
  const [postCurrentPage, setPostCurrentPage] = useState(0); // 게시물 현재 페이지 (0부터 시작)
  const [postTotalPages, setPostTotalPages] = useState(0); // 게시물 전체 페이지 수

  const pageSize = 10;
  const sort = 'updatedAt,desc';

  // 단체 리스트 불러오는 함수
  const fetchAgencyList = async (page) => {
    try {
      const res = await api.get('/admin/team-list', {
        params: { page: page, size: pageSize, sort: sort },
      });
      setAgencyRequests(res.data.data?.content || []);
      setAgencyTotalPages(res.data.data?.totalPages || 0);
    } catch (err) {
      console.error('단체 신청 리스트 불러오기 실패:', err);
    }
  };

  // 게시물 리스트 불러오는 함수
  const fetchPostList = async (page) => {
    try {
      const res = await api.get('/admin/post-list', {
        params: { page: page, size: pageSize, sort: sort },
      });
      setPostRequests(res.data.data?.content || []);
      setPostTotalPages(res.data.data?.totalPages || 0);
    } catch (err) {
      console.error('게시물 리스트 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchAgencyList(agencyCurrentPage);
    fetchPostList(postCurrentPage);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    // 탭 변경 시 해당 탭의 현재 페이지로 다시 데이터 로드
    // 이미 useEffect에서 초기 로드를 했으므로, 필요에 따라서는 이 부분은 제거해도 됩니다.
    // 여기서는 탭 변경 시 리스트를 최신화하는 목적으로 유지합니다.
    if (newValue === 0) {
      fetchAgencyList(agencyCurrentPage);
    } else {
      fetchPostList(postCurrentPage);
    }
  };

  // 단체 페이지 변경 핸들러
  const handleAgencyPageChange = (event, value) => {
    const newPage = value - 1; // Material-UI Pagination은 1부터 시작, 백엔드는 0부터 시작
    setAgencyCurrentPage(newPage);
    fetchAgencyList(newPage);
  };

  // 게시물 페이지 변경 핸들러
  const handlePostPageChange = (event, value) => {
    const newPage = value - 1; // Material-UI Pagination은 1부터 시작, 백엔드는 0부터 시작
    setPostCurrentPage(newPage);
    fetchPostList(newPage);
  };
  
  const handleTeamApproval = async (teamId, status) => {
    try {
      await api.patch(`/admin/team-approval/${teamId}`, status, {
        headers: { 'Content-Type': 'application/json' },
      });
      fetchAgencyList(agencyCurrentPage);
    } catch (err) {
      console.error('팀 승인 상태 변경 실패:', err);
    }
  };

  const handlePostApproval = async (postId, status) => {
    try {
      await api.patch(`/admin/post-approval/${postId}`, status, {
        headers: { 'Content-Type': 'application/json' },
      });
      fetchPostList(postCurrentPage);
    } catch (err) {
      console.error('게시물 승인 상태 변경 실패:', err);
    }
  };
  
  // Material-UI Pagination의 renderItem 커스터마이징 함수
  // 이 함수를 컴포넌트 내부에 정의하여 state에 접근 가능하도록 합니다.
  const renderPaginationItems = (item) => {
    const pageGroupSize = 5; // 한 번에 보여줄 페이지 번호 개수
    
    // 현재 활성화된 탭에 따라 totalPages와 currentPage를 동적으로 참조
    let currentTotalPages, currentCurrentPage;
    if (tabIndex === 0) { // 단체 탭일 경우
      currentTotalPages = agencyTotalPages;
      currentCurrentPage = agencyCurrentPage;
    } else { // 게시물 탭일 경우
      currentTotalPages = postTotalPages;
      currentCurrentPage = postCurrentPage;
    }

    const currentGroupStart = Math.floor(currentCurrentPage / pageGroupSize) * pageGroupSize;
    const currentGroupEnd = Math.min(currentGroupStart + pageGroupSize - 1, currentTotalPages - 1); // 0-based

    // 페이지 번호 아이템일 경우만 로직 적용
    if (item.type === 'page') {
      const pageNumber = item.page - 1; // Material-UI는 1-based, 우리는 0-based

      // 현재 페이지 그룹에 포함되지 않으면 null 반환하여 렌더링하지 않음
      if (pageNumber < currentGroupStart || pageNumber > currentGroupEnd) {
        return null;
      }
    }
    // 그 외의 버튼 (<<, <, >, >>, ellipsis)은 기본 렌더링
    return <PaginationItem {...item} />;
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
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="단체 신청 리스트" />
        <Tab label="게시물 신청 리스트" />
      </Tabs>

      {tabIndex === 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 5}}> {/* p (padding)과 mb (margin-bottom) 속성 추가 */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            단체 신청 리스트
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>단체 이름</TableCell>
                <TableCell align="left">설명</TableCell>
                <TableCell align="right">상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agencyRequests.length > 0 ? (
                agencyRequests.map((req, index) => (
                  <TableRow key={index} sx={{ height: '60px' }}>
                    <TableCell>{req.createdAt ? req.createdAt.substring(0, 16).replace('T', ' \u00A0\u00A0') : '-'}</TableCell>
                    <TableCell>{req.name}</TableCell>
                    <TableCell align="left">{req.description}</TableCell>
                    <TableCell align="right" sx={{ minWidth: '120px' }}>
                      {req.approvalStatus === 'PENDING' && (
                        <>
                          <Button variant="outlined" color="success" size="small"
                            sx={{
                              px: 1, py: 1.5, fontSize: '0.9rem',
                              minWidth: 'auto', height: '24px', lineHeight: 1, mx: 0.3
                            }}
                            onClick={() => handleTeamApproval(req.teamId, 'ACCEPTED')}
                          >
                            수락
                          </Button>
                          <Button variant="outlined" color="error" size="small"
                            sx={{
                              px: 1, py: 1.5, fontSize: '0.9rem',
                              minWidth: 'auto', height: '24px', lineHeight: 1, mx: 0.3
                            }}
                            onClick={() => handleTeamApproval(req.teamId, 'REJECTED')}
                          >
                            거절
                          </Button>
                        </>
                      )}
                      {req.approvalStatus === 'ACCEPTED' && (
                        <Button variant="contained" size="small"
                          sx={{
                            px: 1, py: 1.5, fontSize: '0.9rem',
                            minWidth: 'auto', height: '24px', mx: 0.3,
                            backgroundColor: '#4caf50', color: 'white',
                            '&:hover': { backgroundColor: '#388e3c' },
                          }}
                        >
                          수락됨
                        </Button>
                      )}
                      {req.approvalStatus === 'REJECTED' && (
                        <Button variant="contained" size="small"
                          sx={{
                            px: 1, py: 1.5, fontSize: '0.9rem',
                            minWidth: 'auto', height: '24px', mx: 0.5,
                            backgroundColor: '#f44336', color: 'white',
                            '&:hover': { backgroundColor: '#d32f2f' },
                          }}
                        >
                          거절됨
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {agencyTotalPages > 0 && (
            <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
              <Pagination
                count={agencyTotalPages}
                page={agencyCurrentPage + 1}
                onChange={handleAgencyPageChange}
                showFirstButton
                showLastButton
                renderItem={renderPaginationItems} // 수정된 부분
              />
            </Stack>
          )}
        </Paper>
      )}

      {tabIndex === 1 && (
        <Paper elevation={3} sx={{ p: 3, mb: 5 }}>
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
              {postRequests.length > 0 ? (
                postRequests.map((post, index) => (
                  <TableRow key={index} sx={{ height: '60px' }}>
                    <TableCell>{post.createdAt ? post.createdAt.substring(0, 16).replace('T', ' \u00A0\u00A0') : '-'}</TableCell>
                    <TableCell>{post.teamName}</TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.categoryName}</TableCell>
                    <TableCell align="right" sx={{ minWidth: '120px' }}>
                      {post.approvalStatus === 'PENDING' && (
                        <>
                          <Button variant="outlined" color="success" size="small"
                            sx={{
                              px: 1, py: 1.5, fontSize: '0.9rem',
                              minWidth: 'auto', height: '24px', lineHeight: 1, mx: 0.3
                            }}
                            onClick={() => handlePostApproval(post.id, 'ACCEPTED')}
                          >
                            수락
                          </Button>
                          <Button variant="outlined" color="error" size="small"
                            sx={{
                              px: 1, py: 1.5, fontSize: '0.9rem',
                              minWidth: 'auto', height: '24px', lineHeight: 1, mx: 0.3
                            }}
                            onClick={() => handlePostApproval(post.id, 'REJECTED')}
                          >
                            거절
                          </Button>
                        </>
                      )}
                      {post.approvalStatus === 'ACCEPTED' && (
                        <Button variant="contained" size="small"
                          sx={{
                            px: 1, py: 1.5, fontSize: '0.9rem',
                            minWidth: 'auto', height: '24px', lineHeight: 1, mx: 0.3,
                            backgroundColor: '#4caf50', color: 'white',
                            '&:hover': { backgroundColor: '#388e3c' },
                          }}
                        >
                          수락됨
                        </Button>
                      )}
                      {post.approvalStatus === 'REJECTED' && (
                        <Button variant="contained" size="small"
                          sx={{
                            px: 1, py: 1.5, fontSize: '0.9rem',
                            minWidth: 'auto', height: '24px', lineHeight: 1, mx: 0.3,
                            backgroundColor: '#f44336', color: 'white',
                            '&:hover': { backgroundColor: '#d32f2f' },
                          }}
                        >
                          거절됨
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {postTotalPages > 0 && (
            <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
              <Pagination
                count={postTotalPages}
                page={postCurrentPage + 1}
                onChange={handlePostPageChange}
                showFirstButton
                showLastButton
                renderItem={renderPaginationItems} // 수정된 부분
              />
            </Stack>
          )}
        </Paper>
      )}
    </Box>
  );
}