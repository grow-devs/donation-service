import * as React from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { IconButton, Badge, Box, Paper } from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import FloatingAuthModal from "../modal/FloatingAuthModal";
import useAuthStore from "../store/authStore";
import AutoChangingText from '../motion/AutoChangingText';

export default function MainAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userRole = useAuthStore((state) => state.userRole);
  const nickName = useAuthStore((state) => state.nickName);

  return (
    <Box sx={{ mb: 9 }}>
      <Paper
        elevation={1}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          borderRadius: 3,
          mx: { xs: 2, sm: 3, md: 10 },
          mb: 3,
          px: { xs: "4%", sm: "8%" },
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
      >
        <AppBar
          position="static"
          color="inherit"
          sx={{
            borderRadius: 3,
            boxShadow: "none",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              position: "relative",  // 절대 위치 자식 때문에 상대 위치 필요
              px: { xs: 1, sm: 2 },
              minHeight: 64,
            }}
          >
            {/* 왼쪽: 서비스 이름 */}
            <Box sx={{ flexShrink: 0 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                onClick={() => navigate("/")}
                sx={{
                  cursor: "pointer",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                같이가치
              </Typography>
            </Box>

            {/* 가운데: 절대 위치로 중앙 고정 */}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",  // 클릭 이벤트 막기 (필요시 제거)
                userSelect: "none",
                display: { xs: "none", sm: "block" }, // 모바일에서 숨김
                maxWidth: "60%", // 너무 길면 줄임
                textAlign: "center",
              }}
            >
              <AutoChangingText />
            </Box>

            {/* 오른쪽: 아이콘들 */}
            <Box
              sx={{
                ml: "auto",
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 150,
                justifyContent: "flex-end",
              }}
            >
              {isLoggedIn && (
                <IconButton
                  size="large"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Badge
                    badgeContent={100}
                    sx={{
                      "& .MuiBadge-badge": {
                        minWidth: "20px",
                        height: "20px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                        fontSize: "0.7rem",
                        color: "#fff",
                        background: "#ea3030ff",
                        transform: "scale(1) translate(50%, -50%)",
                      },
                    }}
                  >
                    <NotificationsNoneIcon fontSize="medium" color="primary" />
                  </Badge>
                </IconButton>
              )}

              <IconButton
                size="large"
                onClick={() => {
                  if (isLoggedIn) {
                    navigate("/mypage");
                  } else {
                    setOpen(true);
                  }
                }}
              >
                <AccountCircleIcon fontSize="medium" color="primary" />
                <Typography
                  variant="body2"
                  color="black"
                  noWrap
                  sx={{
                    ml: 0.5,
                    maxWidth: 80,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isLoggedIn ? `${nickName} 님` : "로그인"}
                </Typography>
              </IconButton>

              {userRole === "ADMIN_ROLE" && (
                <IconButton
                  size="large"
                  onClick={() => navigate("/admin-page")}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <AdminPanelSettingsIcon fontSize="medium" />
                </IconButton>
              )}
            </Box>

            <FloatingAuthModal open={open} onClose={() => setOpen(false)} />
          </Toolbar>
        </AppBar>
      </Paper>
    </Box>
  );
}
