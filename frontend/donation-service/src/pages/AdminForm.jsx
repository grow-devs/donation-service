// src/pages/AdminForm.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
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
  FormControl, // 드롭다운을 위한 컴포넌트 추가
  InputLabel, // 드롭다운 레이블 추가
  Select, // 드롭다운 컴포넌트 추가
  MenuItem, // 드롭다운 아이템 추가
} from '@mui/material';
import api from '../apis/api'; // API 호출을 위한 api 인스턴스 임포트

export default function AdminForm() {
  // 현재 활성화된 탭의 인덱스 (0: 단체, 1: 게시물)
  const [tabIndex, setTabIndex] = useState(0);

  // 단체 신청 리스트 데이터 상태
  const [agencyRequests, setAgencyRequests] = useState([]);
  // 게시물 신청 리스트 데이터 상태
  const [postRequests, setPostRequests] = useState([]);

  // 단체 리스트의 현재 페이지 (0부터 시작하는 백엔드 페이지네이션에 맞춤)
  const [agencyCurrentPage, setAgencyCurrentPage] = useState(0);
  // 단체 리스트의 전체 페이지 수
  const [agencyTotalPages, setAgencyTotalPages] = useState(0);
  // 게시물 리스트의 현재 페이지
  const [postCurrentPage, setPostCurrentPage] = useState(0);
  // 게시물 리스트의 전체 페이지 수
  const [postTotalPages, setPostTotalPages] = useState(0);

  // 단체 리스트의 필터 상태 (기본값 'ALL')
  const [agencyFilterStatus, setAgencyFilterStatus] = useState('ALL');
  // 게시물 리스트의 필터 상태 (기본값 'ALL')
  const [postFilterStatus, setPostFilterStatus] = useState('ALL');

  // 한 페이지당 보여줄 항목 수 (백엔드와 일치해야 함)
  const pageSize = 10;
  // 데이터 정렬 기준 (업데이트 시간 내림차순)
  const sort = 'updatedAt,desc';

  /**
   * 단체 신청 리스트를 불러오는 비동기 함수
   * @param {number} page - 요청할 페이지 번호 (0-based)
   * @param {string} filterStatus - 필터링할 승인 상태 ('ALL', 'PENDING', 'ACCEPTED', 'REJECTED')
   */
  const fetchAgencyList = async (page, filterStatus = 'ALL') => {
    try {
      const params = { page: page, size: pageSize, sort: sort };
      // 'ALL' 상태가 아닐 때만 approvalStatus 파라미터를 추가하여 백엔드로 전송
      if (filterStatus !== 'ALL') {
        params.approvalStatus = filterStatus;
      }
      const res = await api.get('/admin/team-list', { params });
      // API 응답에서 content와 totalPages를 추출하여 상태 업데이트
      setAgencyRequests(res.data.data?.content || []);
      setAgencyTotalPages(res.data.data?.totalPages || 0);
    } catch (err) {
      console.error('단체 신청 리스트 불러오기 실패:', err);
    }
  };

  /**
   * 게시물 신청 리스트를 불러오는 비동기 함수
   * @param {number} page - 요청할 페이지 번호 (0-based)
   * @param {string} filterStatus - 필터링할 승인 상태 ('ALL', 'PENDING', 'ACCEPTED', 'REJECTED')
   */
  const fetchPostList = async (page, filterStatus = 'ALL') => {
    try {
      const params = { page: page, size: pageSize, sort: sort };
      // 'ALL' 상태가 아닐 때만 approvalStatus 파라미터를 추가하여 백엔드로 전송
      if (filterStatus !== 'ALL') {
        params.approvalStatus = filterStatus;
      }
      const res = await api.get('/admin/post-list', { params });
      // API 응답에서 content와 totalPages를 추출하여 상태 업데이트
      setPostRequests(res.data.data?.content || []);
      setPostTotalPages(res.data.data?.totalPages || 0);
    } catch (err) {
      console.error('게시물 리스트 불러오기 실패', err);
    }
  };

  // 컴포넌트가 처음 마운트될 때 초기 데이터 로드
  useEffect(() => {
    fetchAgencyList(agencyCurrentPage, agencyFilterStatus);
    fetchPostList(postCurrentPage, postFilterStatus);
  }, []); // 빈 의존성 배열은 컴포넌트 마운트 시 한 번만 실행됨을 의미

  /**
   * 탭 변경 이벤트 핸들러
   * @param {object} event - 이벤트 객체
   * @param {number} newValue - 선택된 탭의 인덱스
   */
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    // 탭 변경 시 해당 탭의 현재 페이지와 필터 상태로 데이터 다시 로드
    if (newValue === 0) {
      fetchAgencyList(agencyCurrentPage, agencyFilterStatus);
    } else {
      fetchPostList(postCurrentPage, postFilterStatus);
    }
  };

  /**
   * 단체 리스트의 페이지 변경 핸들러
   * @param {object} event - 이벤트 객체
   * @param {number} value - 변경된 페이지 번호 (Material-UI Pagination은 1-based)
   */
  const handleAgencyPageChange = (event, value) => {
    const newPage = value - 1; // 백엔드는 0-based 페이지 번호를 사용하므로 1을 빼줌
    setAgencyCurrentPage(newPage); // 현재 페이지 상태 업데이트
    fetchAgencyList(newPage, agencyFilterStatus); // 새 페이지로 데이터 불러오기
  };

  /**
   * 게시물 리스트의 페이지 변경 핸들러
   * @param {object} event - 이벤트 객체
   * @param {number} value - 변경된 페이지 번호 (Material-UI Pagination은 1-based)
   */
  const handlePostPageChange = (event, value) => {
    const newPage = value - 1; // 백엔드는 0-based 페이지 번호를 사용하므로 1을 빼줌
    setPostCurrentPage(newPage); // 현재 페이지 상태 업데이트
    fetchPostList(newPage, postFilterStatus); // 새 페이지로 데이터 불러오기
  };
  
  /**
   * 단체 승인 상태 업데이트 핸들러
   * @param {number} teamId - 업데이트할 팀 ID
   * @param {string} status - 변경할 승인 상태 ('ACCEPTED' 또는 'REJECTED')
   */
  const handleTeamApproval = async (teamId, status) => {
    try {
      await api.patch(`/admin/team-approval/${teamId}`, status, {
        headers: { 'Content-Type': 'application/json' }, // JSON 형태로 Content-Type 명시
      });
      // 승인/거절 후 현재 페이지의 리스트를 다시 불러와 UI 업데이트
      fetchAgencyList(agencyCurrentPage, agencyFilterStatus);
    } catch (err) {
      console.error('팀 승인 상태 변경 실패:', err);
    }
  };

  /**
   * 게시물 승인 상태 업데이트 핸들러
   * @param {number} postId - 업데이트할 게시물 ID
   * @param {string} status - 변경할 승인 상태 ('ACCEPTED' 또는 'REJECTED')
   */
  const handlePostApproval = async (postId, status) => {
    try {
      await api.patch(`/admin/post-approval/${postId}`, status, {
        headers: { 'Content-Type': 'application/json' }, // JSON 형태로 Content-Type 명시
      });
      // 승인/거절 후 현재 페이지의 리스트를 다시 불러와 UI 업데이트
      fetchPostList(postCurrentPage, postFilterStatus);
    } catch (err) {
      console.error('게시물 승인 상태 변경 실패:', err);
    }
  };
  
  /**
   * 단체 리스트 필터 드롭다운 변경 핸들러
   * @param {object} event - 이벤트 객체
   */
  const handleAgencyFilterChange = (event) => {
    const newStatus = event.target.value; // 선택된 새로운 필터 상태 값
    setAgencyFilterStatus(newStatus); // 필터 상태 업데이트
    setAgencyCurrentPage(0); // 필터 변경 시 현재 페이지를 0 (첫 페이지)으로 리셋
    fetchAgencyList(0, newStatus); // 새 필터와 첫 페이지로 데이터 다시 불러오기
  };

  /**
   * 게시물 리스트 필터 드롭다운 변경 핸들러
   * @param {object} event - 이벤트 객체
   */
  const handlePostFilterChange = (event) => {
    const newStatus = event.target.value; // 선택된 새로운 필터 상태 값
    setPostFilterStatus(newStatus); // 필터 상태 업데이트
    setPostCurrentPage(0); // 필터 변경 시 현재 페이지를 0 (첫 페이지)으로 리셋
    fetchPostList(0, newStatus); // 새 필터와 첫 페이지로 데이터 다시 불러오기
  };

  /**
   * Material-UI Pagination의 renderItem prop을 위한 커스터마이징 함수
   * 페이지 번호를 5개 단위로만 보여주도록 로직을 추가합니다.
   * 이 함수는 컴포넌트 내부에 정의되어 state에 직접 접근할 수 있습니다.
   * @param {object} item - Material-UI PaginationItem이 제공하는 아이템 정보
   */
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

    // 현재 페이지가 속한 그룹의 시작 페이지 (0-based)
    const currentGroupStart = Math.floor(currentCurrentPage / pageGroupSize) * pageGroupSize;
    // 현재 페이지 그룹의 마지막 페이지 (0-based), 전체 페이지 수를 넘지 않도록 제한
    const currentGroupEnd = Math.min(currentGroupStart + pageGroupSize - 1, currentTotalPages - 1);

    // 페이지 번호 아이템일 경우만 커스터마이징 로직 적용
    if (item.type === 'page') {
      const pageNumber = item.page - 1; // Material-UI는 1-based, 백엔드는 0-based

      // 현재 페이지 그룹에 포함되지 않으면 null을 반환하여 렌더링하지 않음
      if (pageNumber < currentGroupStart || pageNumber > currentGroupEnd) {
        return null;
      }
    }
    // 그 외의 버튼 (<<, <, >, >>, ellipsis)은 기본 PaginationItem으로 렌더링
    return <PaginationItem {...item} />;
  };


  return (
    <Box
      sx={{
        width: '70%', // 전체 너비의 70%
        margin: '0 auto', // 가운데 정렬
        mt: 5, // 상단 마진
        display: 'flex',
        flexDirection: 'column', // 세로 방향 정렬
        gap: 5, // 컴포넌트 간 간격
      }}
    >
      {/* 탭 메뉴 */}
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="단체 신청 리스트" />
        <Tab label="게시물 신청 리스트" />
      </Tabs>

      {/* 단체 신청 리스트 탭 내용 */}
      {tabIndex === 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 5}}> {/* Paper 컴포넌트 (음영 효과 있는 배경) */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            단체 신청 리스트
          </Typography>
          {/* 상태 필터 드롭다운 */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="agency-status-select-label">상태</InputLabel>
              <Select
                labelId="agency-status-select-label"
                id="agency-status-select"
                value={agencyFilterStatus}
                label="상태"
                onChange={handleAgencyFilterChange}
              >
                <MenuItem value="ALL">ALL</MenuItem>
                <MenuItem value="PENDING">대기중</MenuItem>
                <MenuItem value="ACCEPTED">수락됨</MenuItem>
                <MenuItem value="REJECTED">거절됨</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
              {/* agencyRequests 데이터가 있을 경우 매핑하여 테이블 행 렌더링 */}
              {agencyRequests.length > 0 ? (
                agencyRequests.map((req, index) => (
                  <TableRow key={index} sx={{ height: '60px' }}>
                    <TableCell>
                      {/* createdAt 날짜 포맷팅 */}
                      {req.createdAt ? req.createdAt.substring(0, 16).replace('T', ' \u00A0\u00A0') : '-'}
                    </TableCell>
                    <TableCell>{req.name}</TableCell>
                    <TableCell align="left">{req.description}</TableCell>
                    <TableCell align="right" sx={{ minWidth: '120px' }}>
                      {/* 승인 상태에 따른 버튼 렌더링 */}
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
                            backgroundColor: '#4caf50', // 초록색 배경
                            color: 'white',
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
                            backgroundColor: '#f44336', // 빨간색 배경
                            color: 'white',
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
                // 데이터가 없을 경우 '데이터가 없습니다.' 메시지 표시
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* 페이지네이션 컴포넌트 */}
          {agencyTotalPages > 0 && (
            <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
              <Pagination
                count={agencyTotalPages} // 전체 페이지 수
                page={agencyCurrentPage + 1} // 현재 페이지 (UI는 1부터 시작)
                onChange={handleAgencyPageChange} // 페이지 변경 시 호출될 핸들러
                showFirstButton // 맨 처음 페이지로 이동하는 버튼 (<<)
                showLastButton // 맨 마지막 페이지로 이동하는 버튼 (>>)
                renderItem={renderPaginationItems} // 페이지 아이템 커스터마이징 함수
              />
            </Stack>
          )}
        </Paper>
      )}

      {/* 게시물 신청 리스트 탭 내용 */}
      {tabIndex === 1 && (
        <Paper elevation={3} sx={{ p: 3, mb: 5 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            게시물 신청 리스트
          </Typography>
          {/* 상태 필터 드롭다운 */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="post-status-select-label">상태</InputLabel>
              <Select
                labelId="post-status-select-label"
                id="post-status-select"
                value={postFilterStatus}
                label="상태"
                onChange={handlePostFilterChange}
              >
                <MenuItem value="ALL">ALL</MenuItem>
                <MenuItem value="PENDING">대기중</MenuItem>
                <MenuItem value="ACCEPTED">수락됨</MenuItem>
                <MenuItem value="REJECTED">거절됨</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>단체 이름</TableCell>
                <TableCell>게시물 제목</TableCell>
                <TableCell>카테고리</TableCell>
                <TableCell align="right">상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* postRequests 데이터가 있을 경우 매핑하여 테이블 행 렌더링 */}
              {postRequests.length > 0 ? (
                postRequests.map((post, index) => (
                  <TableRow key={index} sx={{ height: '60px' }}>
                    <TableCell>
                      {/* createdAt 날짜 포맷팅 */}
                      {post.createdAt ? post.createdAt.substring(0, 16).replace('T', ' \u00A0\u00A0') : '-'}
                    </TableCell>
                    <TableCell>{post.teamName}</TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.categoryName}</TableCell>
                    <TableCell align="right" sx={{ minWidth: '120px' }}>
                      {/* 승인 상태에 따른 버튼 렌더링 */}
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
                            backgroundColor: '#4caf50',
                            color: 'white',
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
                            backgroundColor: '#f44336',
                            color: 'white',
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
                // 데이터가 없을 경우 '데이터가 없습니다.' 메시지 표시
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* 페이지네이션 컴포넌트 */}
          {postTotalPages > 0 && (
            <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
              <Pagination
                count={postTotalPages}
                page={postCurrentPage + 1}
                onChange={handlePostPageChange}
                showFirstButton
                showLastButton
                renderItem={renderPaginationItems} // 페이지 아이템 커스터마이징 함수
              />
            </Stack>
          )}
        </Paper>
      )}
    </Box>
  );
}