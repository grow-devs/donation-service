// RankingCard.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProfileInRankingCard from "./ProfileInRankingCard";
import { useNavigate } from "react-router-dom";
import api from "../apis/api";

export default function RankingCard() {
  const [ranks, setRanks] = useState([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    let params = {
      size: 10,
      page: 0,
    };

    try {
      const res = await api.get("/ranking/today", { params });
      const data = res.data.data;
      console.log(data.rankings);

      setRanks(data.rankings);
    } catch (e) {
      console.error("오늘의 랭킹 top 10 조회 실패", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card
      sx={{
        // cursor: "pointer",
        borderRadius: 3,
        boxShadow: 2,
        width: '100%',
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 헤더 */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          오늘의 기부 랭킹
          <Button
            size="small"
            variant="text"
            onClick={() => navigate("/RankingPage")}
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: "small" }} />}
            sx={{
              minWidth: "auto", // 최소 너비 제거
              height: "24px", // 높이 직접 설정
              padding: "0 8px", // 패딩 조절
              fontSize: "0.75rem", // 폰트 크기 조절
            }}
          >
            더 보러가기
          </Button>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          지금 이 순간, 가장 따뜻한 사람들
        </Typography>
      </Box>

      {/* 랭킹 리스트 */}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          px: 2,
          pb: 2,
        }}
      >
        {ranks.length > 0 ? (
          ranks.map((rank, index) => (
            <ProfileInRankingCard
              key={index}
              rank={rank.rank}
              nickname={rank.nickName}
              amount={rank.totalAmount}
              profileImage={rank.profileImageUrl}
            />
          ))
        ) : (
          <Card
            sx={{
              textAlign: "center",
              padding: "5px",
              maxWidth: "100%",
              margin: "0 auto",
              borderRadius: "16px",
              boxShadow: "0 0px 0px rgba(0,0,0,0.1)",
              // backgroundColor: "#f8f9faff",
            }}
          >
            <Box sx={{ color: "gold", marginBottom: "10px" }}>
              <EmojiEventsIcon sx={{ fontSize: 50 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                marginBottom: "5px",
                color: "#343a40",
              }}
            >
              아직 첫 번째 기부자가 없어요!
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#6c757d", marginBottom: "15px" }}
            >
              지금 기부하고 오늘의 첫 번째 주인공이 되어보세요!
            </Typography>
            <Button
              variant="contained"
              size="medium"
              sx={{
                backgroundColor: "#ffd000ff",
                "&:hover": {
                  backgroundColor: "#ffd0008d",
                },
                fontWeight: "bold",
                borderRadius: "25px",
                padding: "5px 25px",
              }}
              onClick={() => navigate("/postListPage")}
            >
              기부하러 가기
            </Button>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
