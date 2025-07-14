import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export default function AutoChangingText() {
  const messages = [
    "함께 살아가는 우리 기부 플랫폼과 함께하세요",
    "당신의 작은 손길이 큰 변화를 만듭니다",
    "지금 바로 참여해보세요!"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: "1.5rem", // 높이 고정 (글씨 높이에 맞춰)
        overflow: "hidden",
        display: { xs: "none", sm: "block" }, // sm 이상에서만
        width: "350px", // 너비 고정해주면 깜빡임 방지
        mx: 0 // 양옆 여백 (선택)
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          style={{ position: "absolute", width: "100%" }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
          >
            {messages[index]}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
