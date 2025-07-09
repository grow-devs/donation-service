import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import CategoryTabs from "../components/CategoryTabs";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import { posts } from "../data/posts";

const categories = [
  { id: 0, name: "전체" },
  { id: 6, name: "어르신" },
  { id: 1, name: "아동·청소년" },
  { id: 2, name: "동물" },
  { id: 3, name: "환경" },
  { id: 4, name: "장애인" },
  { id: 5, name: "지구촌" },
  { id: 7, name: "사회" },
];

export default function PostListPage() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [sortOrder, setSortOrder] = useState("추천순");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로딩 시뮬레이션
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedCategory, sortOrder]);

  // 필터링
  let filteredPosts =
    selectedCategory === 0
      ? posts
      : posts.filter((p) => p.categoryId === selectedCategory);

  // 정렬 (간단 예시: 추천순=참여자수 많은순)
  if (sortOrder === "추천순") {
    filteredPosts = [...filteredPosts].sort(
      (a, b) => b.participants - a.participants
    );
  }

  const introPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <Container sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </Box>
      <Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "black",
              fontWeight: "bold",
              // textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            진행중 모금함 {categories.length-1}
          </Typography>

          <FormControl variant="standard" size="small">
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              disableUnderline
              sx={{
                bgcolor: "transparent",
                boxShadow: "none",
                "& fieldset": { border: "none" },
              }}
            >
              <MenuItem value="추천순"><Typography variant='body2'>추천순</Typography></MenuItem>
              <MenuItem value="최신순"><Typography variant='body2'>최신순</Typography></MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Grid container justifyContent="center">
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      width: 'fit-content',
      margin: '0 auto',
      justifyContent: 'flex-start',
    }}
  >
    {loading ? (
      Array.from(new Array(8)).map((_, idx) => (
        <Box key={idx} sx={{ width: 270 }}>
          <PostCardSkeleton />
        </Box>
      ))
    ) : (
      <>
        {/* {introPost && (
          <Box sx={{ width: 270 }}>
            <IntroCard post={introPost} />
          </Box>
        )} */}
        {otherPosts.map((post) => (
          <Box key={post.id} sx={{ width: 270 }}>
            <PostCard post={post} />
          </Box>
        ))}
      </>
    )}
  </Box>
</Grid>
      </Grid>
    </Container>
  );
}
