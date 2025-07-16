import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import CategoryTabs from "../components/CategoryTabs";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import postapi from "../apis/postapi";

const categories = [
  { id: 0, name: "전체" },
  { id: 1, name: "아동·청소년" },
  { id: 2, name: "환경" },
  { id: 3, name: "동물" },
  { id: 4, name: "어르신" },
  { id: 5, name: "사회" },
  { id: 6, name: "지구촌" },
  { id: 7, name: "장애인" },
];

export default function PostListPage() {
  const daysLeft = null;
  const { categoryId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(
    Number(categoryId) || 0
  );
  const [sortOrder, setSortOrder] = useState("추천순"); // '추천순' (participantsDesc) 또는 '최신순' (latest)

  const [posts, setPosts] = useState([]);

  // lastId 외의 다른 커서 필드들을 추가로 관리합니다.
  const [lastId, setLastId] = useState(null);
  const [lastCreatedAt, setLastCreatedAt] = useState(null); // 'latest' 정렬용
  const [lastEndDate, setLastEndDate] = useState(null); // 'deadline' 정렬용 (백엔드에 'deadline' 정렬 추가 가정)
  const [lastFundingAmount, setLastFundingAmount] = useState(null); // 'fundingAmountDesc' 정렬용 (백엔드에 추가 가정)
  const [lastParticipants, setLastParticipants] = useState(null); // 'participantsDesc' (추천순) 정렬용
  // 새로운 상태 추가: 첫 페이지 로드인지 확인
  const [initialLoad, setInitialLoad] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // 전체 게시물 개수를 저장할 새로운 상태 추가
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const observer = useRef();

  // 마지막 카드 관찰 (스크롤 끝 감지)
  /**
   * "사용자가 스크롤을 내려서 현재 로딩 중이 아니고,
   * 아직 더 불러올 데이터가 있으며,
   * 마지막 게시물 카드가 화면에 보일 때만 다음 페이지의 데이터를 불러와줘" 라는 로직을 구현
   */
  const lastPostElementRef = useCallback(
    (node) => {
      // 1. 이미 로딩 중이면 추가 요청 방지
      if (loading) return;

      // 2. 기존 옵저버가 있다면 연결 해제
      if (observer.current) observer.current.disconnect();

      // 3. 새 IntersectionObserver 인스턴스 생성
      observer.current = new IntersectionObserver((entries) => {
        // 4. 마지막 요소가 화면에 보이고, 더 가져올 데이터가 있으며, 현재 로딩 중이 아닐 때
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts(false); // isInitial이 false (추가 데이터 요청)
        }
      });

      // 5. 관찰할 노드(요소)가 존재하면 옵저버에 등록
      if (node) observer.current.observe(node);
    },
    [loading, hasMore] // loading, hasMore 변경 시 observer 재생성
  );

  // 카테고리 또는 정렬 변경 시 모든 상태 초기화 및 데이터 재요청
  useEffect(() => {
    // setPosts([]);
    // 모든 last 필드를 초기화합니다.
    setLastId(null);
    setLastCreatedAt(null);
    setLastEndDate(null);
    setLastFundingAmount(null);
    setLastParticipants(null);

    setHasMore(true);
    
    fetchPosts(true); // isInitial이 true (초기 데이터 요청)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortOrder]); // sortOrder도 의존성 배열에 포함

  // API 요청 함수 (isInitial: 초기 요청 여부)
  // API 요청 함수 (isInitial: 초기 요청 여부)
  const fetchPosts = (isInitial = false) => {
    if (loading) return;
    if (!hasMore && !isInitial) return;

    setLoading(true);

    let params = {
      size: 12,
      categoryId: selectedCategory !== 0 ? selectedCategory : undefined,
      lastId: !isInitial ? lastId : undefined, // isInitial이 아닐 때만 lastId 전달
      initialLoad: initialLoad,
    };

    switch (sortOrder) {
      case "추천순":
        params.sortBy = "participantsDesc";
        if (!isInitial) params.lastParticipants = lastParticipants; // ✅ 각 정렬 케이스에서 직접 last 값 할당
        break;
      case "최신순":
        params.sortBy = "latest";
        if (!isInitial) params.lastCreatedAt = lastCreatedAt; // ✅ 각 정렬 케이스에서 직접 last 값 할당
        break;
      case "종료임박순":
        params.sortBy = "deadlineAsc";
        if (!isInitial) params.lastEndDate = lastEndDate; // ✅ 각 정렬 케이스에서 직접 last 값 할당
        break;
      // TODO: 필요한 다른 정렬 기준들을 여기에 추가하세요.
      // case "목표액높은순":
      //   params.sortBy = "targetAmountDesc";
      //   if (!isInitial) params.lastFundingAmount = lastFundingAmount;
      //   break;
      default:
        params.sortBy = "latest";
        if (!isInitial) params.lastCreatedAt = lastCreatedAt; // 기본값일 경우도 처리
        break;
    }

     postapi
      .get("/post", { params })
      .then((res) => {
        const postListResult = res.data.data; // Result 객체의 'data' 필드에 접근

        //PostListResultDto의 게시물 목록 필드 이름이 'resultList'입니다.
        const newPosts = postListResult.resultList; // PostListResultDto의 'resultList' 필드 접근
        const totalCount = postListResult.totalCount; // PostListResultDto의 'totalCount' 필드 접근

        // 초기 요청일 때만 totalPostsCount를 업데이트
        if (isInitial) {
          setTotalPostsCount(totalCount);
        }

        setPosts((prev) => (isInitial ? newPosts : [...prev, ...newPosts]));

        setHasMore(newPosts.length === 12); // 정확히 12개면 더 있다고 판단, 아니면 없다고 판단

        if (newPosts.length > 0) {
          const lastFetchedPost = newPosts[newPosts.length - 1];
          setLastId(lastFetchedPost.id);

          // 현재 로직은 이미 switch문에서 params.sortBy가 결정되었기 때문에,
          // 해당 sortBy에 맞는 last 필드를 업데이트하는 것이 중요
          switch (params.sortBy) {
            case "latest":
              setLastCreatedAt(lastFetchedPost.createdAt);
              break;
            case "participantsDesc":
              setLastParticipants(lastFetchedPost.participants);
              break;
            case "deadlineAsc":
              setLastEndDate(lastFetchedPost.deadline);
              break;
            case "fundingAmountDesc": // 주석 풀었다면 사용
              setLastFundingAmount(lastFetchedPost.currentAmount);
              break;
            default:
              // 기본 정렬 (latest)의 last 값도 처리
              setLastCreatedAt(lastFetchedPost.createdAt);
              break;
          }
        } else if (isInitial) {
          // 초기 로드인데 데이터가 없으면 hasMore는 false
          setHasMore(false);
        }
      })
      .catch((err) => {
        console.error("게시물 로드 중 에러 발생:", err);
        setHasMore(false);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoad(false); // 로딩이 끝나면 initialLoad를 false로 설정
      });
  };
  // 탭 변경 핸들러
  const handleCategoryChange = (newCategoryId) => {
    setSelectedCategory(newCategoryId);
    setInitialLoad(true); // 탭 변경 시 initialLoad를 true로 설정
    setTotalPostsCount(0); // 새 카테고리 로드 시 총 개수 초기화
  };

  // 정렬 순서 변경 핸들러
  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setInitialLoad(true); // 정렬 변경 시 initialLoad를 true로 설정
    setTotalPostsCount(0); // 새 정렬 로드 시 총 개수 초기화
  };
  return (
    <Container sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onChange={(handleCategoryChange)}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          mt: 1,
        }}
      >
        <Typography variant="h5" sx={{ color: "black", fontWeight: "bold" }}>
          진행중 모금함 {totalPostsCount} {/* 전체 카테 제외한 개수 */}
        </Typography>
        <FormControl variant="standard" size="small">
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            disableUnderline
            sx={{ bgcolor: "transparent", "& fieldset": { border: "none" } }}
          >
            <MenuItem value="추천순">
              <Typography variant="body2">추천순</Typography>
            </MenuItem>
            <MenuItem value="최신순">
              <Typography variant="body2">최신순</Typography>
            </MenuItem>
            {/* TODO: 다른 정렬 기준이 있다면 MenuItem 추가 */}
            <MenuItem value="종료임박순">
              <Typography variant="body2">종료임박순</Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container justifyContent="center">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            width: "fit-content",
            margin: "0 auto",
            justifyContent: "flex-start",
          }}
        >
          {posts.map((post, index) => {
            const now = new Date(); // 컴포넌트 렌더링 시점의 현재 시간 (클라이언트 로컬)
            const deadlineDate = new Date(post.deadline); // post.deadline (LocalDateTime 문자열)을 클라이언트 로컬 시간대로 해석하여 Date 객체 생성
            // 두 Date 객체의 getTime() 값은 UTC 기준 밀리초이므로, 이들의 차이는 정확한 시간 간격을 나타냅니다.
            const daysLeft = Math.max(
              0,
              Math.ceil(
                (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              )
            );
            if (index === posts.length - 1) {
              return (
                //posts.map 내부의 마지막 PostCard를 감시하기 위해 ref={lastPostElementRef}로 연결
                <Box key={post.id} sx={{ width: 270 }} ref={lastPostElementRef}>
                  <PostCard
                    post={post}
                    sortOrder={sortOrder}
                    daysLeft={daysLeft}
                  />
                </Box>
              );
            }
            return (
              <Box key={post.id} sx={{ width: 270 }}>
                <PostCard
                  post={post}
                  sortOrder={sortOrder}
                  daysLeft={daysLeft}
                />
              </Box>
            );
          })}
          {/* 첫 로딩이거나, 이미 데이터가 있는 상태에서 추가 로딩 중일 때만 스켈레톤 표시 */}
          {loading &&
            (posts.length === 0 || !initialLoad) &&
            Array.from(new Array(4)).map((_, idx) => (
              <Box key={idx} sx={{ width: 270 }}>
                <PostCardSkeleton />
              </Box>
            ))}

          {/* 데이터가 없고, 로딩 중도 아닐 때 메시지 표시 */}
          {!loading && !hasMore && posts.length === 0 && (
            <Typography variant="h6" color="textSecondary" sx={{ mt: 5 }}>
              게시물이 없습니다.
            </Typography>
          )}
        </Box>
      </Grid>
    </Container>
  );
}
