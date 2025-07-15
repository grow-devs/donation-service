import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function PostCard({ post }) {
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
        <Typography variant="subtitle2" fontWeight="bold" noWrap>
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          fontSize="0.8rem"
          fontWeight="500"
        >
          총 {(post.participants ?? 0).toLocaleString()}명이 참여중
        </Typography>
      </CardContent>
    </Card>
  );
}
