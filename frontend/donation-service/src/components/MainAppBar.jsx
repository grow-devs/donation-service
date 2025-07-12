// MainAppBar.jsx
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { IconButton, Tooltip } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Badge, Button } from "@mui/material";
import FloatingAuthModal from "../modal/FloatingAuthModal";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import useAuthStore from "../store/authStore";
export default function MainAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userRole = useAuthStore((state) => state.userRole);
  const nickName = useAuthStore((state) => state.nickName);
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 3,
        /* 반응형 좌우 마진: xs(작은화면)=2, sm=3, md 이상=16 */
        mx: { xs: 2, sm: 3, md: 10 },
        /* 상하 마진 조금 줄이고 싶다면 my: { xs:1, sm:2 } 등도 가능 */
        mt: 2,
        mb: 3,
        /* 반응형 패딩: xs=4%, sm 이상=8% */
        px: { xs: "4%", sm: "8%" },
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
            justifyContent: "space-between",
            /* 툴바 내부도 반응형 px  */
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* 클릭하면 메인페이지로의 이동 */}

          {/* 왼쪽: 서비스 이름 (항상 보임) */}
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
                // textDecoration: 'underline', // 또는 색상 변경
              },
            }}
          >
            같이가치
          </Typography>

          {/* 가운데: 문구 → sm 미만일 땐 숨김 */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontStyle: "normal",
              fontSize: "1rem",
              display: { xs: "none", sm: "block" }, // 핵심!
            }}
          >
            함께 살아가는 우리 기부 플랫폼과 함께하세요
          </Typography>

          {/* 오른쪽: 아이콘 */}
          <Box>
            {isLoggedIn ? (
              <IconButton
                size="large"
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                  mx: 0.5,
                }}
              >
                {/* 알림 뱃지 */}
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
                      background: "#ea3030ff", // 알림 빨간색
                      transform: "scale(1) translate(50%, -50%)",
                    },
                  }}
                >
                  <NotificationsNoneIcon fontSize="medium" color="primary" />{" "}
                  {/* 아이콘은 브랜드 색 or 다크톤 */}
                </Badge>
              </IconButton>
            ) : (
              <></>
            )}
            <IconButton
              size="large"
              onClick={() => {
                if (isLoggedIn) {
                  navigate("/mypage"); // 로그인되어 있으면 마이페이지로 이동
                } else {
                  setOpen(true); // 로그인되어 있지 않으면 모달 열기
                }
              }}
            >
              <AccountCircleIcon fontSize="medium" color="primary" />
              {isLoggedIn ? (
                <Typography variant="body2" color="black">
                  {nickName} &nbsp;님
                </Typography>
              ) : (
                <Typography variant="body2" color="black">
                 &nbsp;로그인
                </Typography>
              )}

            </IconButton>
            {/* 관리자 전용 아이콘 */}
            {userRole==='ADMIN_ROLE'&&(
                <IconButton
                  size="large"
                  onClick={() => navigate("/admin-page")}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" },
                    mx: 0.5,
                  }}
                >
                  <AdminPanelSettingsIcon fontSize="mediuem"/>
                </IconButton>
              )}
          </Box>

          <FloatingAuthModal open={open} onClose={() => setOpen(false)} />
        </Toolbar>
      </AppBar>
    </Paper>
  );
}
