import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Button,
  Tabs,
  Tab,
  Skeleton,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import api from "../apis/api";

const tabOptions = ["오늘의 랭킹", "최근 30일 랭킹", "명예의 전당"];
const rankColors = ["gold", "silver", "#cd7f32"];

// 🎯 실제 API 요청 함수
const fetchRankingData = async (tabIndex, page) => {
  let endpoint;
  if (tabIndex === 0) {
    endpoint = "/ranking/today";
  } else if (tabIndex === 1) {
    endpoint = "/ranking/monthly";
  } else if (tabIndex === 2) {
    endpoint = "/ranking";
  } else {
    throw new Error("Invalid tab index");
  }

  try {
    const response = await api.get(endpoint, {
      params: {
        page,
        size: 10,
      },
    });

    const data = response.data.data;
    return {
      rankings: data.rankings,
      hasMore: data.hasNext,
    };
  } catch (error) {
    console.error("Failed to fetch ranking data:", error);
    throw error;
  }
};

// 🎯 내 랭킹 조회 함수
const fetchMyRanking = async () => {
  try {
    const res = await api.get("/ranking/my");
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch my ranking:", error);
    throw error;
  }
};
// 어제 기준 30일전 날짜 계산 함수
const getMonthlyDateRange = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const thirtyDaysAgo = new Date(yesterday);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return `${formatDate(thirtyDaysAgo)} ~ ${formatDate(yesterday)} `;
};

export default function RankingPage() {
  const [tabLoading, setTabLoading] = useState({});

  const { isLoggedIn, nickName } = useAuthStore();
  const [tabIndex, setTabIndex] = useState(0);
  const [rankingData, setRankingData] = useState({}); // 객체로 변경
  const [loading, setLoading] = useState(true);
  const [myRanking, setMyRanking] = useState(null);
  const [myRankingLoading, setMyRankingLoading] = useState(false);

  // 탭 변경 시 호출
  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
  };

  // 더보기 버튼 클릭 시 호출
  const handleLoadMore = async () => {
    if (!rankingData[tabIndex]?.hasMore) return;
    setLoadingMore(true);

    const nextPage = (rankingData[tabIndex]?.page || 0) + 1;
    try {
      const { rankings, hasMore } = await fetchRankingData(tabIndex, nextPage);
      setRankingData((prev) => ({
        ...prev,
        [tabIndex]: {
          page: nextPage,
          data: [...prev[tabIndex].data, ...rankings],
          hasMore,
        },
      }));
    } finally {
      setLoadingMore(false);
    }
  };

  // ✅ 랭킹 데이터 로딩
  useEffect(() => {
    const loadRankingData = async () => {
      if (rankingData[tabIndex] && rankingData[tabIndex].data?.length > 0)
        return;

      const currentPage = rankingData[tabIndex]?.page || 0;

      // 탭별 로딩 시작
      setTabLoading((prev) => ({ ...prev, [tabIndex]: true }));

      try {
        const { rankings, hasMore } = await fetchRankingData(
          tabIndex,
          currentPage
        );
        setRankingData((prev) => ({
          ...prev,
          [tabIndex]: {
            page: currentPage,
            data: [...(prev[tabIndex]?.data || []), ...rankings],
            hasMore,
          },
        }));
      } catch (error) {
        console.error("Error loading ranking data:", error);
      } finally {
        // 탭별 로딩 종료
        setTabLoading((prev) => ({ ...prev, [tabIndex]: false }));
      }
    };
    loadRankingData();
  }, [tabIndex]);

  // ✅ 더보기를 위한 추가 데이터 로딩
  useEffect(() => {
    const loadMoreData = async () => {
      const currentTabState = rankingData[tabIndex];
      if (
        !currentTabState ||
        currentTabState.page === 0 ||
        !currentTabState.hasMore
      )
        return;

      const nextPage = currentTabState.page + 1;

      // 탭별 로딩 시작
      setTabLoading((prev) => ({ ...prev, [tabIndex]: true }));

      try {
        const { rankings, hasMore } = await fetchRankingData(
          tabIndex,
          nextPage
        );
        setRankingData((prev) => ({
          ...prev,
          [tabIndex]: {
            page: nextPage,
            data: [...prev[tabIndex].data, ...rankings],
            hasMore,
          },
        }));
      } catch (error) {
        console.error("Error loading more ranking data:", error);
      } finally {
        // 탭별 로딩 종료
        setTabLoading((prev) => ({ ...prev, [tabIndex]: false }));
      }
    };

    loadMoreData();
  }, [rankingData[tabIndex]?.page]);

  // ✅ 내 랭킹 데이터 로딩 (로그인 상태일 때만)
  useEffect(() => {
    const loadMyRanking = async () => {
      if (!isLoggedIn) {
        setMyRanking(null);
        return;
      }

      try {
        setMyRankingLoading(true);
        const data = await fetchMyRanking();
        setMyRanking(data);
      } catch (error) {
        console.error("Error loading my ranking:", error);
        setMyRanking(null);
      } finally {
        setMyRankingLoading(false);
      }
    };

    loadMyRanking();
  }, [isLoggedIn, tabIndex]); // 로그인 상태나 탭이 변경될 때마다 내 랭킹을 새로 불러옵니다.

  const getTitle = () => {
    if (tabIndex === 0) return "🌟 오늘의 기부 히어로";
    if (tabIndex === 1) return "📅 최근 30일 기부 랭킹";
    return "🏅 명예의 전당";
  };

  const getSubtitle = () => {
    if (tabIndex === 0) return "오늘 하루 복 많이 받으실 분들입니다 🎁";
    if (tabIndex === 1)
      return `${getMonthlyDateRange()} 동안 가장 따뜻한 마음을 나눠주신 분들 ❤️`;
    return "역대 기부 천사 분들✨";
  };

  // 현재 탭의 데이터 및 상태를 추출
  const currentRankings = rankingData[tabIndex]?.data || [];
  const hasMore = rankingData[tabIndex]?.hasMore || false;
  const currentPage = rankingData[tabIndex]?.page || 0;

  return (
    <Container sx={{ py: 0 }}>
      {/* 🧷 탭 + 제목 + 기준 고정 */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "#f9f9f9",
          zIndex: 10,
          pt: 1,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3.5 }}
        >
          {tabOptions.map((label, i) => (
            <Tab key={i} label={label} />
          ))}
        </Tabs>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            {getTitle()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getSubtitle()}
          </Typography>
        </Box>
        <Divider />
      </Box>

      {/* 📊 랭킹 카드 리스트 */}
      <Stack spacing={1.5} alignItems="center" mt={2} mb={8}>
        {/* ✅ 로딩 중일 때만 스켈레톤을 표시합니다. */}
        {tabLoading[tabIndex] ? (
          // 로딩 중일 때 스피너 표시
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200, // 가운데 정렬
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : currentRankings.length > 0 ? (
          // 데이터 있을 때 랭킹 리스트 표시
          currentRankings.map((user) => (
            <Card
              key={user.userId}
              sx={{
                width: 600,
                borderLeft: `5px solid ${
                  rankColors[user.rank - 1] || "#ffb64d"
                }`,
                minHeight: 56,
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                      width: 30,
                      textAlign: "center",
                      color: rankColors[user.rank - 1] || "#ffb64d",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {user.rank}
                  </Typography>
                  <Avatar
                    src={user.avatar || user.profileImageUrl}
                    alt={user.nickName}
                    sx={{ width: 40, height: 40, mx: 2 }}
                  />
                  <Typography
                    variant="subtitle2"
                    fontWeight={500}
                    sx={{ margin: 0, padding: 0 }}
                  >
                    {user.nickName}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    border: "1px solid #e0e0e0",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {(user.totalAmount || 0).toLocaleString()} 포인트
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          // 로딩 완료 후 데이터가 없을 때 메시지 표시
          <Paper
            elevation={0}
            sx={{
              width: 600,
              minHeight: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              my: 4,
              p: 2,
              border: "1px dashed #e0e0e0",
              bgcolor: "grey.50",
            }}
          >
            <VolunteerActivismIcon
              sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
            />
            <Typography variant="h6" color="text.secondary">
              아직 기부하신 분들이 안계십니다.
            </Typography>
          </Paper>
        )}

        {/* ✅ 더보기 버튼 영역 */}
        {loading && currentPage > 0 && <CircularProgress sx={{ my: 2 }} />}

        {hasMore && !loading && (
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            sx={{ width: 600, mt: 2 }}
          >
            더보기
          </Button>
        )}
      </Stack>

      {/* ⭐️ 내 순위 고정 영역 - 로그인 상태일 때만 표시 */}
      {isLoggedIn && myRanking && (
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 5,
            width: "100%",
            py: 0,
          }}
        >
          <Card
            sx={{
              width: 600,
              mx: "auto",
              bgcolor: "white",
              boxShadow: 5,
              borderLeft: "5px solid #1976d2",
              borderRight: "1px solid #1976d2",
              borderBottom: "1px solid #1976d2",
              borderTop: "1px solid #1976d2",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1,
                padding: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{
                    width: 30,
                    textAlign: "center",
                    color: "#1976d2",
                  }}
                >
                  {myRanking.rank}
                </Typography>
                <Avatar
                  src={myRanking.avatar || myRanking.profileImageUrl}
                  alt={myRanking.nickName}
                  sx={{ width: 40, height: 40, mx: 2 }}
                />
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  color="text.primary"
                >
                  {nickName}
                </Typography>
              </Box>

              {/* --- 변경된 부분 --- */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    sx={{ lineHeight: 1 }}
                  >
                    상위 {myRanking.percentile}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    color: "text.secondary",
                    border: "1px solid #e0e0e0",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {(myRanking.totalAmount || 0).toLocaleString()} 포인트
                </Typography>
              </Box>
              {/* --- 변경된 부분 끝 --- */}
            </CardContent>
          </Card>
        </Box>
      )}
      {/* --- 변경된 부분 끝 --- */}
    </Container>
  );
}
