import React, { useEffect, useState } from "react";
import { Card, Box, Typography, CardContent } from "@mui/material";
import VolunteerActivismSharpIcon from "@mui/icons-material/VolunteerActivismSharp";
import dayjs from "dayjs";
import api from "../apis/api";

/**
 * stats: [{ id, label, value }, …]
 */
export default function TodayStats() {
  const [totalDonors, setTotalDonors] = useState(null);
  const [firstDonation, setFirstDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/meta/totalDonors");
        const data = res.data.data.totalDonors;
        console.log("총 후원자수 조회", data);
        setTotalDonors(data);
      } catch (e) {
        console.error("총 후원자수 조회 실패", e);
      } finally {
        setLoading(false); // 데이터 로딩이 완료되면 로딩 상태 해제
      }

      try {
        const res = await api.get("/meta/firstDonation");
        const data = res.data.data;
        console.log("오늘 첫 기부 정보 조회", data.nickName);
        setFirstDonation(data);
      } catch (e) {
        console.error("오늘 첫 기부 정보 조회 실패", e);
      } finally {
        setLoading(false); // 데이터 로딩이 완료되면 로딩 상태 해제
      }
    };
    fetchData();
  }, []);

  const period = dayjs(firstDonation.createdAt).hour < 12 ? "오전" : "오후";
  const totalSupporters = "0";
  const biggestAmount = "0원";
  const firstDonorName = firstDonation.nickName;
  const firstDonorTime = firstDonation?.createdAt
    ? (() => {
        const date = dayjs(firstDonation.createdAt);
        const hour = date.hour();
        const period = hour < 12 ? "오전" : "오후";
        const h = hour % 12 === 0 ? 12 : hour % 12; // 12시간제
        const m = date.minute();
        return `${period} ${h}시 ${m}분`;
      })()
    : "오후 1시";

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 4, // 둥근 모서리를 더 부드럽게
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)", // 더 깊이 있는 그림자
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 1. 감성적인 헤더 */}
      <Box
        sx={{
          p: 1.5,
          background: "linear-gradient(15deg, #FF9A9E 100%, #FAD0C4 100%)", // 핑크색 그라데이션
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body1"
          fontWeight={600} // 더 굵은 폰트
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          {/* <VolunteerActivismSharpIcon /> */}
          오늘의 기부 이야기
        </Typography>
      </Box>

      {/* 2. 스토리텔링 내용 */}
      <CardContent sx={{ p: 2, bgcolor: "#fdf7f7" }}>
        {" "}
        {/* 부드러운 배경색 */}
        <Typography
          variant="body1"
          sx={{ fontSize: "0.9rem", lineHeight: 1.5, color: "#555" }}
        >
          오늘도 따뜻한 마음들이 모여 희망을 만들었습니다. 지금 이 순간까지
          <Box component="span" sx={{ color: "#FF6B6B", fontWeight: "bold" }}>
            {" "}
            {totalDonors}명
          </Box>
          의 소중한 동행이 이어지고 있습니다.
        </Typography>
        <br />
        <Typography
          variant="body1"
          sx={{ fontSize: "0.9rem", lineHeight: 1.5, color: "#555" }}
        >
          이 따뜻한 이야기는
          <Box component="span" sx={{ color: "#FF6B6B", fontWeight: "bold" }}>
            {" "}
            {firstDonorTime}{" "}
          </Box>
          ,
          <Box component="span" sx={{ color: "#4A6094", fontWeight: "bold" }}>
            {" "}
            {firstDonorName}님의 첫 기부
          </Box>
          로 시작되었습니다.
        </Typography>
        <br />
        <Typography
          variant="body1"
          sx={{ fontSize: "0.9rem", lineHeight: 1.5, color: "#555" }}
        >
          한 분 한 분의 따뜻한 마음이 모여 모두를 위한 희망의 불꽃이 됩니다.
        </Typography>
      </CardContent>
    </Card>
  );
}
