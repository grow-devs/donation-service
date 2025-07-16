import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function PostCard({ post, sortOrder, daysLeft }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 300, // 카드 전체 높이 고정 (원하는 높이로)
        boxShadow: "none",
        border: "none",
        bgcolor: "transparent",
        cursor: "pointer",
        "&:hover": { transform: "scale(1.01)" },
      }}
    >
      <CardMedia
        component="img"
        image={post.imageUrl}
        alt={post.title}
        sx={{
          height: 192,
          flex: "0 0 64%",
          borderRadius: 2, // 이미지만 둥글게
          width: "100%",
          objectFit: "cover",
        }}
      />
      <CardContent
        sx={{
          flex: "1",
          px: 0,
          py: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight=""
          color="rgba(46, 46, 46, 1)"
          sx={{ mb: 0.3 }}
          noWrap
        >
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          color="rgba(20, 20, 20, 1)"
          fontSize="0.75rem"
          fontWeight="600"
          sx={{
            
            fontFeatureSettings: '"tnum"', // Tabular Numbers 적용
            // fontFeatureSettings: '"tnum", "lnum"', // 여러 기능 적용 시 쉼표로 구분
            // fontFeatureSettings: '"onum"', // Oldstyle Numbers (디자인 컨셉에 따라)
          }}
        >
          {sortOrder === "종료임박순" // '마감임박순' 조건
            ? daysLeft === 0
              ? "오늘 마감"
              : `${daysLeft}일 남음`
            : sortOrder === "최신순" // '최신순' 조건
            ? `${new Date(post.createdAt).toLocaleDateString()}` // 생성일을 날짜 형식으로 변환하여 표시
            : `총 ${(post.participants ?? 0).toLocaleString()}명이 참여중`}{" "}
          {/* 그 외 조건 (예: '추천순') */}
        </Typography>
      </CardContent>
    </Card>
  );
}
