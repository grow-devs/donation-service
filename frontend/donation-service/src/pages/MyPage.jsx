import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Grid,
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
  CardMedia,
  TableContainer
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../store/authStore';
import { format } from "date-fns";
import api from "../apis/api";
import AddPointModal from "../modal/AddPointModal";
import ProfileImageModal from "../modal/ProfileImageModal";
import Tooltip from "@mui/material/Tooltip";

// 게시물 목록 아이템을 렌더링하는 재사용 가능한 컴포넌트
const PostCard = ({ post, navigate }) => {

  // 클릭 이벤트 핸들러: postId를 사용하여 게시물 상세 페이지로 이동
  const handlePostClick = () => {
    if (post.postId) {
      navigate(`/post-detail/${post.postId}`);
    }
  };

  return (
    <Grid item xs={12}>
      <Card
        sx={{ display: 'flex', width: '100%', cursor: 'pointer' }}
        onClick={handlePostClick}
      >
        <CardMedia
          component="img"
          sx={{ width: 151, height: 151, flexShrink: 0 }}
          image={post.thumnbnailImageUrl}
          alt={post.postTitle}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {post.postTitle}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              현재 금액: {post.currentAmount ? post.currentAmount.toLocaleString() : 0} P
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              목표 금액: {post.targetAmount ? post.targetAmount.toLocaleString() : 0} P
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              마감일: {post.deadline ? format(new Date(post.deadline), 'yyyy.MM.dd') : '날짜 없음'}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Grid>
  );
};

export default function MyPage() {
  const [tab, setTab] = useState(0);
  const logout = useAuthStore(state => state.logout);
  const setProfileImage = useAuthStore((state) => state.setProfileImage);

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null); // ✨ 사용자 정보를 저장할 state
  const [userInfoLoading, setUserInfoLoading] = useState(true); // ✨ 로딩 상태
  const [userInfoError, setUserInfoError] = useState(null); // ✨ 에러 상태

  // ✨ 기부 내역 상태
  const [donations, setDonations] = useState([]);
  const [donationCurrentPage, setDonationCurrentPage] = useState(0);
  const [donationTotalPages, setDonationTotalPages] = useState(0);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donationsError, setDonationsError] = useState(null);

  // 즐겨 찾기 상태
  const [favorites, setFavorites] = useState([]);
  const [favoritesCurrentPage, setFavoritesCurrentPage] = useState(0);
  const [favoritesTotalPages, setFavoritesTotalPages] = useState(0);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);

  // 내가 작성한 게시글 상태
  const [myPosts, setMyPosts] = useState([]);
  const [myPostsCurrentPage, setMyPostsCurrentPage] = useState(0);
  const [myPostsTotalPages, setMyPostsTotalPages] = useState(0);
  const [myPostsLoading, setMyPostsLoading] = useState(false);
  const [myPostsError, setMyPostsError] = useState(null);

  // 포인트 추가 모달 상태
  const [isAddPointModalOpen, setIsAddPointModalOpen] = useState(false);

  // 프로필 이미지 변경 관련 상태 및 ref
  const fileInputRef = useRef(null);
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  // 백엔드와 동일한 정렬 조건과 페이지 사이즈
  const pageSize = 3;
  const createdAtDesc = 'createdAt,desc'; // 즐겨찾기, 내가 작성한 게시글은 동일한 정렬 사용

  const handleChange = (event, newValue) => {
    setTab(newValue);
    if (newValue === 0) {
      setDonationCurrentPage(0);
    } else if (newValue === 1) {
      setFavoritesCurrentPage(0);
    } else if (newValue === 2) { // 내가 작성한 게시글 탭
      setMyPostsCurrentPage(0);
    }
  };

  // ⭐️ fetchUserInfo 함수를 컴포넌트 최상위 스코프로 이동하고 useCallback으로 감싸줍니다.
  const fetchUserInfo = useCallback(async () => {
    try {
      setUserInfoLoading(true);
      // 백엔드 /api/user/info 엔드포인트 호출
      const response = await api.get('/user/info');
      setUserInfo(response.data.data); // ✨ 불러온 사용자 정보 저장
      setProfileImage(response.data.data.profileImageUrl)

    } catch (err) {
      console.error("사용자 정보 불러오기 실패:", err);
      setUserInfoError("사용자 정보를 불러오는 데 실패했습니다.");
    } finally {
      setUserInfoLoading(false);
    }
  }, []); // 의존성 배열이 비어 있으므로, 컴포넌트가 처음 마운트될 때만 함수가 생성됩니다.

  // 컴포넌트 마운트 시 사용자 정보 불러오기
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]); // ⭐️ fetchUserInfo 함수를 의존성 배열에 추가하여 함수 변경 시 다시 실행되도록 합니다.

  /**
   * 기부 내역 리스트를 불러오는 함수 (탭이 변경되거나 페이지가 변경될 때 호출)
   * @param {number} page - 요청할 페이지 번호 (0-based)
   */
  const fetchDonationList = async (page) => {
    // if (tab !== 0) return; // '기부 내역' 탭이 아닐 경우 실행하지 않음
    try {
      setDonationsLoading(true);
      setDonationsError(null);
      const params = { page: page, size: pageSize, sort: createdAtDesc };
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

  /**
 * 즐겨찾기(좋아요) 게시물 리스트를 불러오는 함수 (새로 추가됨)
 * @param {number} page - 요청할 페이지 번호 (0-based)
 */
  const fetchFavoritesList = async (page) => {
    try {
      setFavoritesLoading(true);
      setFavoritesError(null);
      const params = { page: page, size: pageSize, sort: createdAtDesc };
      const res = await api.get('/user/post-like-list', { params });
      setFavorites(res.data.data?.content || []);
      setFavoritesTotalPages(res.data.data?.totalPages || 0);
    } catch (err) {
      console.error('즐겨찾기 목록 불러오기 실패:', err);
      setFavoritesError('즐겨찾기 목록을 불러오는 데 실패했습니다.');
    } finally {
      setFavoritesLoading(false);
    }
  };

  // 내가 작성한 게시글 목록을 불러오는 함수 (새로 추가)
  const fetchMyPostsList = async (page) => {
    try {
      setMyPostsLoading(true);
      setMyPostsError(null);
      const params = { page: page, size: pageSize, sort: createdAtDesc };
      const res = await api.get('/user/my-posts', { params });
      setMyPosts(res.data.data?.content || []);
      setMyPostsTotalPages(res.data.data?.totalPages || 0);
    } catch (err) {
      console.error('내가 작성한 게시물 목록 불러오기 실패:', err);
      setMyPostsError('내가 작성한 게시물 목록을 불러오는 데 실패했습니다.');
    } finally {
      setMyPostsLoading(false);
    }
  };

  // 탭이 변경되거나 페이지가 변경될 때 데이터를 로드하는 useEffect
  useEffect(() => {
    if (tab === 0) {
      fetchDonationList(donationCurrentPage);
    } else if (tab === 1) {
      fetchFavoritesList(favoritesCurrentPage);
    } else if (tab === 2) {
      fetchMyPostsList(myPostsCurrentPage);
    }
  }, [tab, donationCurrentPage, favoritesCurrentPage, myPostsCurrentPage]);

  /**
   * 기부 내역 페이지 변경 핸들러
   * @param {object} event - 이벤트 객체
   * @param {number} value - 변경된 페이지 번호 (Material-UI Pagination은 1-based)
   */
  const handleDonationPageChange = (event, value) => {
    const newPage = value - 1; // 백엔드는 0-based 페이지 번호를 사용하므로 1을 빼줌
    setDonationCurrentPage(newPage);
  };

  /**
   * 즐겨찾기 페이지 변경 핸들러 (새로 추가됨)
   * @param {object} event - 이벤트 객체
   * @param {number} value - 변경된 페이지 번호 (Material-UI Pagination은 1-based)
   */
  const handleFavoritesPageChange = (event, value) => {
    const newPage = value - 1;
    setFavoritesCurrentPage(newPage);
  };

  // 내가 작성한 게시글 페이지 변경 핸들러 (새로 추가)
  const handleMyPostsPageChange = (event, value) => {
    const newPage = value - 1;
    setMyPostsCurrentPage(newPage);
  };

  // '기부 내역'의 테이블 행 클릭 핸들러
  const handleDonationRowClick = (postId) => {
    navigate(`/post-detail/${postId}`);
  };

  // '추가' 버튼 클릭 시 모달을 여는 함수로 변경
  const handleAddPoints = () => {
    setIsAddPointModalOpen(true);
  };

  // 모달 닫기 함수
  const handleCloseAddPointModal = () => {
    setIsAddPointModalOpen(false);
  };

  // 포인트 추가 성공 시 호출될 함수
  const handlePointAdded = () => {
    handleCloseAddPointModal(); // 모달 닫기
    fetchUserInfo(); // 사용자 정보 새로고침
  };

  // 프로필 이미지 클릭 핸들러
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // 파일 선택 시 실행될 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrl(reader.result);
        setIsProfileImageModalOpen(true); // 미리보기 모달 열기
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 저장 핸들러
  const handleSaveProfileImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      await api.post('/user/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('프로필 이미지가 성공적으로 변경되었습니다.');
      setIsProfileImageModalOpen(false);
      setSelectedFile(null);
      setPreviewImageUrl('');
      fetchUserInfo(); // 변경된 이미지 정보로 유저 정보 새로고침
    } catch (err) {
      console.error('프로필 이미지 업로드 실패:', err);
      alert('프로필 이미지 업로드에 실패했습니다.');
    }
  };

  // 프로필 이미지 모달 닫기 핸들러
  const handleCloseProfileImageModal = () => {
    setIsProfileImageModalOpen(false);
    setSelectedFile(null);
    setPreviewImageUrl('');
    // 파일 입력 필드 초기화 (같은 파일을 다시 선택할 경우 onChange 이벤트가 발생하지 않는 문제 방지)
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  // ✨ 로딩 중 또는 에러 발생 시 처리
  if (userInfoLoading) {
    return (
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, px: 1, textAlign: 'center' }}>
        <Typography>사용자 정보를 불러오는 중입니다...</Typography>
      </Box>
    );
  }

  if (userInfoError) {
    return (
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, px: 1, textAlign: 'center' }}>
        <Typography color="error">{userInfoError}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", px: 1, mt: 11, mb: 5 }}>
      {/* 프로필 영역 */}
      <Card sx={{ mb: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", borderRadius: 2 }}>
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
                sx={{ width: 70, height: 70, mr: 2, cursor: 'pointer', border: '1px solid #d1cdcd' }}
                src={userInfo.profileImageUrl}
                onClick={handleAvatarClick} // 클릭 이벤트 추가
              />
              <Box>
                <Typography variant="h6">{userInfo.nickName}</Typography> {/* ✨ 닉네임 또는 이름 표시 */}
                <Typography variant="body1" color="text.secondary">
                  나눔을 실천하는 회원입니다.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  현재 포인트: {userInfo.points ? userInfo.points.toLocaleString() : 0} P {/* 0 또는 null 처리, 천 단위 콤마 */}
                  <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddPoints}
                  sx={{
                    ml: 1, // 버튼과 텍스트 사이 간격
                    py: 0.5,
                    px: 1,
                    fontSize: '0.8rem',
                    minWidth: 'auto',
                  }}
                >
                  포인트 충전
                </Button>
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                logout();
                navigate("/");
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

              {/* 조건: 팀 정보가 없거나(teamName이 null이거나 빈 문자열일 때) 승인 상태가 REJECTED일 경우 '등록' 버튼 노출 */}
              {(!userInfo.teamName || userInfo.approvalStatus === "REJECTED") && (
                <Tooltip title="후원 단체를 등록할 수 있습니다" arrow>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/apply-agency")}
                    sx={{ height: 30 }}
                  >
                    등록
                  </Button>
                </Tooltip>
              )}

              {/* 팀은 있는데 승인 상태에 따라 버튼 노출 */}
              {userInfo.teamName && userInfo.approvalStatus === "PENDING" && (
                <Tooltip title="등록한 후원 단체가 심사 대기 중입니다" arrow> {/* Tooltip 추가 */}
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ height: 30, bgcolor: '#1cb017', color: 'white' }}
                  >
                    PENDING
                  </Button>
                </Tooltip>
              )}

              {/* ACCEPTED 인 경우에는 버튼 자체를 아예 안 보여줌 (아무 것도 렌더링 안 함) */}
            </Box>

            {/* 둘째 줄: 실제 단체 이름 or 없음 */}
            <Typography variant="body1" fontWeight="bold" sx={{ mt: 0.5 }}>
              {userInfo.teamName ? userInfo.teamName : "없음"}
            </Typography>
          </Box>
        </CardContent>

      </Card>

      {/* 숨겨진 파일 입력 필드 */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        style={{ display: 'none' }} 
        accept="image/*"
      />

      {/* 기부내역 요약 */}
      <Card sx={{ mb: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", borderRadius: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              기부 내역 요약
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* 왼쪽: 총 기부금 */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">총 기부 금액</Typography>
              {/* <Typography variant="h6">{userInfo.totalDonationAmount ? userInfo.totalDonationAmount.toLocaleString() : 0} P</Typography> */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">{userInfo.totalDonationAmount ? userInfo.totalDonationAmount.toLocaleString() : 0} P</Typography>
              </Box>
            </Box>

            {/* 오른쪽: 참여한 캠페인 / 기부 횟수 */}
            <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  총 기부 횟수
                </Typography>
                <Typography variant="subtitle1" align="center">
                  {userInfo.totalDonationCount ? userInfo.totalDonationCount : 0} 회
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 활동 요약 */}

      {/* 탭 */}
      <Box sx={{
        border: '1px solid #e0e0e0', // 탭 컨테이너에 테두리를 추가
        borderRadius: 2, // 둥근 모서리 적용
        overflow: 'hidden' // 이 부분이 중요! 자식 요소가 부모의 둥근 모서리를 넘지 않도록 함
      }}>
        <Tabs value={tab} onChange={handleChange} centered size="small">
          <Tab label="기부 내역" />
          <Tab label="즐겨 찾기" />
          <Tab label="내가 작성한 게시글" />
        </Tabs>
        <Box sx={{ mt: 1 }}>
          {/* 기부 내역 탭 */}
          {tab === 0 && (
            <Card sx={{ p: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }} variant="outlined">
              {donationsLoading ? (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography>기부 내역을 불러오는 중입니다...</Typography></Box>
              ) : donationsError ? (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography color="error">{donationsError}</Typography></Box>
              ) : donations.length > 0 ? (
                <>
                  <TableContainer>
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
                          <TableRow
                            key={index}
                            onClick={() => handleDonationRowClick(donation.postId)}
                            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                          >
                            <TableCell>{donation.postTitle}</TableCell>
                            <TableCell align="center">{donation.donationAmount.toLocaleString()} P</TableCell>
                            <TableCell align="right">{format(new Date(donation.donationDate), 'yyyy.MM.dd')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

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

          {/* 즐겨 찾기 탭 */}
          {tab === 1 && (
            <Card
              sx={{ p: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
              variant="outlined"
            >
              {favoritesLoading ? (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography>즐겨찾기 목록을 불러오는 중입니다...</Typography></Box>
              ) : favoritesError ? (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography color="error">{favoritesError}</Typography></Box>
              ) : favorites.length > 0 ? (
                <>
                  <Grid container spacing={2} sx={{ mt: 2, p: 2, flexDirection: 'column' }}>
                    {favorites.map((favorite, index) => (
                      <PostCard key={index} post={favorite} navigate={navigate} />
                    ))}
                  </Grid>
                  <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                    <Pagination
                      count={favoritesTotalPages}
                      page={favoritesCurrentPage + 1}
                      onChange={handleFavoritesPageChange}
                    />
                  </Stack>
                </>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography>즐겨찾기한 게시물이 없습니다.</Typography></Box>
              )}
            </Card>
          )}

          {/* 내가 작성한 게시글 탭 (새로 추가) */}
          {tab === 2 && (
            <Card sx={{ p: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }} variant="outlined">
              {myPostsLoading ? (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography>내가 작성한 게시글 목록을 불러오는 중입니다...</Typography></Box>
              ) : myPostsError ? (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography color="error">{myPostsError}</Typography></Box>
              ) : myPosts.length > 0 ? (
                <>
                  <Grid container spacing={2} sx={{ mt: 2, p: 2, flexDirection: 'column' }}>
                    {myPosts.map((post, index) => (
                      <PostCard key={index} post={post} navigate={navigate} />
                    ))}
                  </Grid>
                  <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                    <Pagination
                      count={myPostsTotalPages}
                      page={myPostsCurrentPage + 1}
                      onChange={handleMyPostsPageChange}
                    />
                  </Stack>
                </>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}><Typography>작성한 게시글이 없습니다.</Typography></Box>
              )}
            </Card>
          )}

        </Box>
      </Box>

    {/* 포인트 추가 모달 추가 */}
    <AddPointModal
        isOpen={isAddPointModalOpen}
        onClose={handleCloseAddPointModal}
        onPointAdded={handlePointAdded}
      />

    {/* 프로필 이미지 미리보기 모달 */}
    <ProfileImageModal
        isOpen={isProfileImageModalOpen}
        onClose={handleCloseProfileImageModal}
        onSave={handleSaveProfileImage}
        previewImage={previewImageUrl}
    />

    </Box>
  );
}
