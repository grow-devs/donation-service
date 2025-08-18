// DonationCardMUI.jsx
import React from "react";
import { Card, CardContent, Avatar, Typography, Box } from "@mui/material";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

function DonationCard({ donation }) {
  const formatAmount = (amount) => {
    if (typeof amount === "number") {
      return new Intl.NumberFormat("ko-KR").format(amount);
    }
    return "0";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "yyyy.MM.dd HH:mm", { locale: ko });
    } catch (e) {
      console.error("날짜 포맷팅 오류:", e);
      return dateString;
    }
  };

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: "calc(50% - 10px)" },
        mb: 2,
        borderRadius: 2,
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        p: 1.5,
        borderLeft: "5px solid #ff69b4",
      }}
    >
      {/* 상단: 프로필 + 닉네임 */}
      <Box display="flex" alignItems="center" mb={1.5}>
        {donation.profileImageUrl ? (
          <Avatar
            src={donation.profileImageUrl}
            alt={`${donation.nickname} 프로필`}
            sx={{ width: 30, height: 30, mr: 1 }}
          />
        ) : (
          <Avatar
            sx={{
              width: 30,
              height: 30,
              mr: 1,
              bgcolor: "#f0f0f0",
              color: "#999",
            }}
          >
            {donation.nickname.charAt(0)}
          </Avatar>
        )}
        <Typography variant="subtitle2" fontWeight={500} noWrap>
          {donation.nickname}
        </Typography>
      </Box>

      {/* 다음 줄: 기부금액 */}
      <Typography variant="body2" color="black" fontWeight={600} fontSize={18} mb={1}>
        {formatAmount(donation.points)}원 기부
      </Typography>

      {/* 메시지 */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1, wordBreak: "break-word" }}
      >
        {donation.message}
      </Typography>

      {/* 날짜 */}
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="caption" color="text.disabled">
          {formatDate(donation.createdAt)}
        </Typography>
      </Box>
    </Card>
  );
}

export default DonationCard;
