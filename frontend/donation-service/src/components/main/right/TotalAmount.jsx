import React, { useEffect, useState } from "react";
import { Card, Box, Typography, Skeleton } from "@mui/material"; // Skeleton 컴포넌트 추가
import api from "../../../apis/api";
import dayjs from 'dayjs';

export default function TotalAmount() {
  const [metaData, setMetaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/meta/totalAmount");
        const data = res.data.data;
        setMetaData(data);
      } catch (e) {
        console.error("총 기부액 조회 실패", e);
      } finally {
        setLoading(false); // 데이터 로딩이 완료되면 로딩 상태 해제
      }
    };
    fetchData();
  }, []);

  // 1. 로딩 중일 때 스켈레톤 UI를 보여줍니다.
  if (loading) {
    return (
      <Card
        sx={{
          bgcolor: "rgb(252, 226, 76)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          p: 2,
        }}
      >
        <Skeleton variant="text" sx={{ width: '80%', mb: 1, fontSize: '1.5rem' }} />
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
      </Card>
    );
  }

  // 2. 데이터가 없으면 (API 호출 실패 등) 메시지를 보여줍니다.
  if (!metaData) {
    return (
      <Card
        sx={{
          width: '100%',
          p: 2,
          textAlign: "center",
          bgcolor: "error.light"
        }}
      >
        <Typography color="white">데이터를 불러올 수 없습니다.</Typography>
      </Card>
    );
  }
  // "rgb(252, 226, 76)",
  // rgba(245, 235, 182, 1) 베이지색
  // 3. 로딩이 완료되고 데이터가 있으면 정상적인 UI를 렌더링합니다.
  return (
    <Card
      sx={{
        bgcolor: "rgba(252, 255, 211, 1)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        p: 2,
      }}
    >
      {/* ... (기존 JSX 코드) ... */}
      <Box
        sx={{
          flex: 3,
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color='rgb(0,0,0)'
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            함께하는 기부로 <br /> 더 나은 세상을 만듭니다.
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {dayjs(metaData.updatedAt).format('(YYYY년 MM월 DD일) 기준')}
          </Typography>
        </Box>
        <Box
          component="img"
          src="src\assets\iconHeartEarth.png"
          alt="Donation"
          sx={{
            width: 80,
            height: 80,
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          bgcolor: "rgba(255, 255, 255, 0.55)",
          borderRadius: 2,
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          총 기부금
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          {metaData.totalAmount.toLocaleString()}원
        </Typography>
      </Box>
    </Card>
  );
}