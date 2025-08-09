// ProfileInRankingCard.jsx
import React from "react";
import { Card, Box, Typography, Avatar } from "@mui/material";

export default function ProfileInRankingCard({ rank, nickname, amount,profileImage }) {
  return (
    <Card
      elevation={1}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1.5,
        borderRadius: 2,
        width: "100%",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      {/* 등수 */}
      <Typography
        variant="subtitle1"
        fontWeight={600}
        color="primary"
        sx={{ minWidth: 0, fontSize: "0.95rem" }}
      >
        {rank}위
      </Typography>
      <Avatar
        src={ profileImage}
        alt={nickname}
        sx={{ width: 30, height: 30, mx: 2 }}
      />
      {/* 닉네임 */}
      <Typography
        variant="body1"
        sx={{
          flexGrow: 1,
          // textAlign: 'center',
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "0.95rem",
        }}
      >
        {nickname}
      </Typography>

      {/* 금액 */}
      <Typography
        variant="subtitle1"
        fontWeight={600}
        color="text.secondary"
        sx={{ minWidth: 80, textAlign: "right", fontSize: "0.95rem" }}
      >
        {amount.toLocaleString()}원
      </Typography>
    </Card>
  );
}
