import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Stack,
  PaginationItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../store/authStore';
import { format } from "date-fns";
import api from "../apis/api";


export default function MyPage() {
  const [tab, setTab] = useState(0);
  const logout = useAuthStore(state => state.logout);

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null); // ✨ 사용자 정보를 저장할 state 추가
  // const [loading, setLoading] = useState(true); // ✨ 로딩 상태 추가
  // const [error, setError] = useState(null); // ✨ 에러 상태 추가
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [userInfoError, setUserInfoError] = useState(null);

  // ✨ 기부 내역 상태
  const [donations, setDonations] = useState([]);
  const [donationCurrentPage, setDonationCurrentPage] = useState(0);
  const [donationTotalPages, setDonationTotalPages] = useState(0);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donationsError, setDonationsError] = useState(null);

  // 백엔드와 동일한 정렬 조건과 페이지 사이즈
  const pageSize = 10;
  const sort = 'updatedAt,desc';

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  // ✨ 컴포넌트 마운트 시 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserInfoLoading(true);

        // 백엔드 /api/user/info 엔드포인트 호출
        const response = await api.get('/user/info');
        console.log('User Info API Response:', response.data.data); // 응답 데이터 확인용
        setUserInfo(response.data.data); // ✨ 불러온 사용자 정보 저장
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
        setUserInfoError("사용자 정보를 불러오는 데 실패했습니다.");
        // alert(err.response?.data?.message || '사용자 정보를 불러오지 못했습니다.'); // 에러 메시지 알림
      } finally {
        setUserInfoLoading(false);
      }
    };

    fetchUserInfo();
  }, []); // 빈 배열: 컴포넌트가 처음 마운트될 때 한 번만 실행

  /**
   * 기부 내역 리스트를 불러오는 함수 (탭이 변경되거나 페이지가 변경될 때 호출)
   * @param {number} page - 요청할 페이지 번호 (0-based)
   */
  const fetchDonationList = async (page) => {
    if (tab !== 0) return; // '기부 내역' 탭이 아닐 경우 실행하지 않음
    try {
      setDonationsLoading(true);
      setDonationsError(null);
      const params = { page: page, size: pageSize, sort: sort };
      const res = await api.get('/user/donation-list', { params });
      console.log('Donation List API Response:', res.data.data); // 응답 데이터 확인
      setDonations(res.data.data?.content || []);
      setDonationTotalPages(res.data.data?.totalPages || 0);
    } catch (err) {
      console.error('기부 내역 불러오기 실패:', err);
      setDonationsError('기부 내역을 불러오는 데 실패했습니다.');
    } finally {
      setDonationsLoading(false);
    }
  };

  // 탭이 변경될 때 '기부 내역' 탭이면 데이터를 로드
  useEffect(() => {
    if (tab === 0) {
      fetchDonationList(donationCurrentPage);
    }
  }, [tab, donationCurrentPage]); // tab 또는 donationCurrentPage가 변경될 때 재실행

  /**
   * 기부 내역 페이지 변경 핸들러
   * @param {object} event - 이벤트 객체
   * @param {number} value - 변경된 페이지 번호 (Material-UI Pagination은 1-based)
   */
  const handleDonationPageChange = (event, value) => {
    const newPage = value - 1; // 백엔드는 0-based 페이지 번호를 사용하므로 1을 빼줌
    setDonationCurrentPage(newPage);
  };

  // ✨ 로딩 중 또는 에러 발생 시 처리
  if (userInfoLoading) {
    return (
      <Box sx={{ maxWidth: 550, mx: "auto", mt: 4, px: 1, textAlign: 'center' }}>
        <Typography>사용자 정보를 불러오는 중입니다...</Typography>
      </Box>
    );
  }

  if (userInfoError) {
    return (
      <Box sx={{ maxWidth: 550, mx: "auto", mt: 4, px: 1, textAlign: 'center' }}>
        <Typography color="error">{userInfoError}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 550, mx: "auto", mt: 4, px: 1 }}>
      {/* 프로필 */}
      <Card sx={{ mb: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
        <CardContent>
          {/* 상단: 프로필 + 버튼 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{ width: 70, height: 70, mr: 2 }}
                src="/profile.jpg"
              />
              <Box>
                <Typography variant="h6">{userInfo.nickName}</Typography> {/* ✨ 닉네임 또는 이름 표시 */}
                <Typography variant="body2" color="text.secondary">
                  나눔을 실천하는 회원입니다.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  현재 포인트: {userInfo.points ? userInfo.points.toLocaleString() : 0} P {/* 0 또는 null 처리, 천 단위 콤마 */}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                logout();
                navigate("/");
                alert("로그아웃 했습니다.");
              }}
              sx={{ height: 25 }}
            >
              로그아웃
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            {/* 첫 줄: '후원 단체' 텍스트 + 버튼 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                후원 단체
              </Typography>
              {!userInfo.teamName && ( // teamName이 null 또는 빈 문자열일 때 true
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/apply-agency")}
                  sx={{ height: 30 }}
                >
                  등록
                </Button>
              )}
            </Box>

            {/* 둘째 줄: 실제 단체 이름 or 없음 */}
            <Typography variant="body1" fontWeight="bold" sx={{ mt: 0.5 }}>
              {userInfo.teamName ? userInfo.teamName : "없음"}
            </Typography>
          </Box>
        </CardContent>

        {/* <CardContent sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          <Avatar sx={{ width: 70, height: 70, mr: 2 }} src="/profile.jpg" />
          <Box>
            <Typography variant="h6">홍길동</Typography>
            <Typography variant="body2" color="text.secondary">나눔을 실천하는 회원입니다.</Typography>
          </Box>
        </CardContent> */}
      </Card>

      {/* 기부내역 */}
      <Card sx={{ mb: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
        <CardContent sx={{ py: 2 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
            기부 내역 요약
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* 왼쪽: 총 기부금 */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">총 기부 금액</Typography>
              <Typography variant="h6">{userInfo.totalDonationAmount ? userInfo.totalDonationAmount.toLocaleString() : 0} P</Typography>
            </Box>

            {/* 오른쪽: 참여한 캠페인 / 기부 횟수 */}
            <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  참여한 캠페인
                </Typography>
                <Typography variant="subtitle1" align="center">
                  데이터 없음
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  총 기부 횟수
                </Typography>
                <Typography variant="subtitle1" align="center">
                  {userInfo.totalDonationCount + " 회"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 활동 요약 */}

      {/* 탭 */}
      <Box>
        <Tabs value={tab} onChange={handleChange} centered size="small">
          <Tab label="기부 내역" />
          <Tab label="참여 내역" />
        </Tabs>
        <Box sx={{ mt: 1 }}>
          {tab === 0 && (
            <Card sx={{ p: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }} variant="outlined">
              {donationsLoading ? (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography>기부 내역을 불러오는 중입니다...</Typography></Box>
              ) : donationsError ? (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography color="error">{donationsError}</Typography></Box>
              ) : donations.length > 0 ? (
                <>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>게시물 제목</TableCell>
                        <TableCell align="center">기부 금액</TableCell>
                        <TableCell align="right">기부 날짜</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {donations.map((donation, index) => (
                        <TableRow key={index}>
                          <TableCell>{donation.postTitle}</TableCell>
                          <TableCell align="center">{donation.donationAmount.toLocaleString()} P</TableCell>
                          <TableCell align="right">{format(new Date(donation.donationDate), 'yyyy.MM.dd')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                    <Pagination
                      count={donationTotalPages}
                      page={donationCurrentPage + 1}
                      onChange={handleDonationPageChange}
                    />
                  </Stack>
                </>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography>기부 내역이 없습니다.</Typography></Box>
              )}
            </Card>
          )}

          {tab === 1 && (
            <Card
              sx={{ p: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
              variant="outlined"
            >
              <Typography variant="body2">
                참여 내역 상세를 불러오는 영역입니다.
              </Typography>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
}
