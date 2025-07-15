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
/**
 * selectedCategory나 sortOrder 변경 시 상태 초기화와 데이터 요청을 동시에 처리
 * fetchPosts 함수에 초기 요청 여부(isInitial)를 받아서 상태 갱신 방식을 달리함
 * lastPostElementRef에서 loading 상태 체크로 중복 호출 방지
 */
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
  const { categoryId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(Number(categoryId) || 0);
  const [sortOrder, setSortOrder] = useState("추천순");

  const [posts, setPosts] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef();

  // 마지막 카드 관찰 (스크롤 끝 감지)
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts(false);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // 카테고리 또는 정렬 변경 시 초기화 및 데이터 재요청
  useEffect(() => {
    setPosts([]);
    setLastId(null);
    setHasMore(true);
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortOrder]);

  // API 요청 함수 (isInitial: 초기 요청 여부)
  const fetchPosts = (isInitial = false) => {
    if (loading) return;
    if (!hasMore && !isInitial) return;

    setLoading(true);

    postapi
      .get("/post", {
        params: {
          lastId: isInitial ? null : lastId,
          size: 20,
          sortBy: sortOrder === "추천순" ? "participantsDesc" : "latest",
          categoryId: selectedCategory !== 0 ? selectedCategory : undefined,
        },
      })
      .then((res) => {
        const newPosts = res.data.data;
        setPosts((prev) => (isInitial ? newPosts : [...prev, ...newPosts]));
        if (newPosts.length < 20) {
          setHasMore(false);
        }
        if (newPosts.length > 0) {
          setLastId(newPosts[newPosts.length - 1].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
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
          진행중 모금함 {categories.length - 1}
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
            if (index === posts.length - 1) {
              return (
                <Box key={post.id} sx={{ width: 270 }} ref={lastPostElementRef}>
                  <PostCard post={post} />
                </Box>
              );
            }
            return (
              <Box key={post.id} sx={{ width: 270 }}>
                <PostCard post={post} />
              </Box>
            );
          })}
          {loading &&
            Array.from(new Array(4)).map((_, idx) => (
              <Box key={idx} sx={{ width: 270 }}>
                <PostCardSkeleton />
              </Box>
            ))}
        </Box>
      </Grid>
    </Container>
  );
}
