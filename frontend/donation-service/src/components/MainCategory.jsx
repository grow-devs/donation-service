import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

import iconAll from "../assets/iconAll.png";
import iconAnimal from "../assets/iconAnimal.png";
import iconChild from "../assets/iconChild.png";
import iconDisable from "../assets/iconDisable.png";
import iconEarth from "../assets/iconEarth.png";
import iconGrandma from "../assets/iconGrandma.png";
import iconSocial from "../assets/iconSocial.png";
import iconTree from "../assets/iconTree.png";

export default function MainCategory() {
  const navigate = useNavigate();
  const categories = [
    { id: 0, label: "전체", icon: iconAll },
    { id: 1, label: "아동", icon: iconChild },
    { id: 2, label: "환경", icon: iconTree },
    { id: 3, label: "동물", icon: iconAnimal },
    { id: 4, label: "어르신", icon: iconGrandma },
    { id: 5, label: "사회", icon: iconSocial },
    { id: 6, label: "지구촌", icon: iconEarth },
    { id: 7, label: "장애인", icon: iconDisable },
  ];

  const handleCategoryClick = (cat) => {
    if (cat.label === "전체") {
      navigate("/postListPage");
    } else {
      navigate(`/postListPage/${cat.id}`);
    }
  };

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2, // 간격 조절
        px: 2,
        py: 2, // 패딩 조절
        width: "100%",
      }}
    >
      <Typography
        variant="h6" // ✨ 제목 폰트 크기 조절
        fontWeight="bold" // ✨ 제목 폰트 굵기 조절
        fontSize={"1.0rem"}
        sx={{
          color: "#2d2d2dff",
          px: 1, // ✨ 좌측 정렬을 위해 좌측 패딩 추가
        }}
      >
        관심있는 모금함에 들어가보세요!
      </Typography>

<Box
  component="nav"
  sx={{
    display: "flex",
    flexWrap: "wrap", // 줄바꿈 허용
    justifyContent: "center", // 중앙 정렬
    gap: { xs: 1, sm: 1.6 }, // 간격 줄이기
    px: 1,
    "&::-webkit-scrollbar": { display: "none" },
  }}
>
  {categories.map((cat, idx) => (
    <Box
      key={idx}
      onClick={() => handleCategoryClick(cat)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: { xs: 50, sm: 60 },
        cursor: "pointer",
        "&:hover": { opacity: 0.8 },
      }}
    >
      <Box
        sx={{
          width: { xs: 38, sm: 42 },
          height: { xs: 38, sm: 42 },
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={cat.icon}
          alt={cat.label}
          style={{ width: "80%", height: "80%" }}
        />
      </Box>
      <Typography
        variant="caption"
        sx={{
          mt: 0.5,
          bgcolor: "rgba(224, 224, 224, 0.5)",
          color: "#424242",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          px: 1.2,
          py: 0.4,
          borderRadius: 3,
          fontSize: { xs: "0.65rem", sm: "0.75rem" },
        }}
      >
        {cat.label}
      </Typography>
    </Box>
  ))}
</Box>

    </Card>
  );
}