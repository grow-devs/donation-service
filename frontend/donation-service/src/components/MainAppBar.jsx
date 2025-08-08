import * as React from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  IconButton,
  Badge,
  Box,
  Paper,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { formatNotificationTime } from '../utils/formatNotificationTime';
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import FloatingAuthModal from "../modal/FloatingAuthModal";
import useAuthStore from "../store/authStore";
import AutoChangingText from "../motion/AutoChangingText";
import api from "../apis/api"; // ✅ axios 인스턴스 경로에 맞게 수정

// 오늘 날짜를 가져오는 헬퍼 함수
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 날짜 비교 헬퍼 함수
const isToday = (dateString) => {
  const todayString = getTodayDateString();
  return dateString.startsWith(todayString);
};

export default function MainAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userRole = useAuthStore((state) => state.userRole);
  const nickName = useAuthStore((state) => state.nickName);

  const [notifications, setNotifications] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openNotification = Boolean(anchorEl);

  // navigate(경로)가 변경될 때마다 읽지 않은 알림 갯수 최신화
  React.useEffect(() => {
    if (isLoggedIn) {
      unreadCountApi();
    }
  }, [isLoggedIn, navigate]); // navigate를 의존성 배열에 추가하여 경로 변경 시에도 실행되도록 함

  // 초기 진입시 읽지않은 알람 갯수 조회
  const unreadCountApi = React.useCallback(async () => {
    try {
      const res = await api.get("/alarm/unread-count");
      setUnreadCount(res.data.data);
    } catch (e) {
      console.error("알람 카운트 조회 실패", e);
      // 사용자에게 직접적인 alert 대신 콘솔 로그를 활용하여 에러 메시지를 보여주는 것이 좋습니다.
      // 필요하다면 스낵바 등으로 사용자에게 에러를 알릴 수 있습니다.
    }
  }, []);

  // 알림 조회 (항상 API 호출)
  const alarmApi = React.useCallback(async () => {
    if (isLoading) return; // 이미 로딩 중이면 중복 호출 방지
    try {
      setIsLoading(true);
      const res = await api.get("/alarm", {
        params: {
          page,
          size: 10,
        },
      });
      console.log(res.data.data);
      const newAlarms = res.data.data.content;
      const isLastPage = res.data.data.last;

      setNotifications((prev) => [...prev, ...newAlarms]);
      setPage((prev) => prev + 1);
      setHasMore(!isLastPage);
    } catch (e) {
      console.error("알람 불러오기 실패", e);
      // 알림 로딩 실패 시 사용자 경험을 고려하여 적절한 폴백 처리가 필요합니다.
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading]); // page와 isLoading을 의존성 배열에 추가

  // 알림 읽음 처리
  const alarmReadApi = async (alarmId) => {
    try {
      await api.patch(`alarm/${alarmId}`);
      // 성공적으로 읽음 처리된 경우에만 UI 업데이트
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === alarmId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (e) {
      console.error("알람 읽기 실패", e);
      alert("알림 읽기 실패, 다시 시도해주세요."); // 실패 시 사용자에게 알림
      // 롤백 로직 (선택 사항): 필요하다면 isRead 상태를 다시 false로 되돌릴 수 있습니다.
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    // 알림 아이콘 클릭 시 항상 알림 목록 API 호출
    setNotifications([]); // 팝오버 열릴 때마다 기존 알림 초기화
    setPage(0); // 페이지도 초기화
    setHasMore(true); // 더보기 가능성 초기화
    alarmApi();
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
    // 팝오버가 완전히 닫힌 후에 상태 초기화 (지연 처리)
    setTimeout(() => {
      setNotifications([]);
      setPage(0);
      setHasMore(true);
    }, 300); // 300ms 후에 초기화 (팝오버 애니메이션 완료 후)
    
    if (isLoggedIn) unreadCountApi(); // 팝오버 닫을 때 읽지 않은 알림 갯수 최신화
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      alarmApi();
    }
  };

  const handleNotificationItemClick = async (notificationId, postId) => {
    await alarmReadApi(notificationId); // 읽음 처리 API 호출 및 UI 업데이트
    if (postId) {
      // 실제 알림이 온 것이 아니기 때문에 post로 가는 navigate는 주석처리
      // navigate(`/post/${postId}`);
      navigate('/')
      handleNotificationClose();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // 모든 알림을 읽음 처리하는 API (가정)
      // 실제 백엔드 API에 따라 구현 방식이 달라질 수 있습니다.
      await api.patch("/alarm/read-all");

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0); // 모든 알림을 읽었으므로 뱃지 카운트 0으로 설정
      setTimeout(() => {
        handleNotificationClose();
      }, 600);
    } catch (e) {
      console.error("모든 알림 읽음 처리 실패", e);
      alert("모든 알림 읽음 처리 실패, 다시 시도해주세요.");
    }
  };

  const todayNotifications = notifications.filter((n) => isToday(n.createdAt));
  const previousNotifications = notifications.filter(
    (n) => !isToday(n.createdAt)
  );

  const renderNotificationGroup = (group, title) => {
    if (group.length === 0) return null;

    return (
      <>
        <Typography
          variant="subtitle2"
          sx={{
            px: 2,
            py: 1,
            fontSize:"0.8rem",
            fontWeight: "bold",
            color: "rgba(26, 26, 255, 0.57)",
            backgroundColor: "grey.50",
          }}
        >
          {title}
        </Typography>
        {group.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem
              button
              onClick={() =>
                handleNotificationItemClick(
                  notification.id,
                  notification.postId
                )
              }
              sx={{
                borderRadius: 1,
                opacity: notification.isRead ? 0.5 : 1,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                transition: "opacity 0.3s ease",
              }}
            >
              <ListItemText
                primary={notification.message}
                secondary={formatNotificationTime(notification.createdAt)}
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: notification.isRead ? "normal" : "medium",
                  color: notification.isRead
                    ? "text.secondary"
                    : "text.primary",
                }}
                secondaryTypographyProps={{
                  variant: "caption",
                  color: "text.secondary",
                }}
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <Box sx={{ mb: 8 }}>
      <Paper
        elevation={1}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          borderRadius: 3,
          mx: { xs: 2, sm: 3, md: 20 },
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
              position: "relative",
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

            {/* 가운데: 고정 문구 */}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                userSelect: "none",
                display: { xs: "none", sm: "block" },
                maxWidth: "60%",
                textAlign: "center",
              }}
            >
              <AutoChangingText />
            </Box>

            {/* 오른쪽: 아이콘 */}
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
                  onClick={handleNotificationClick}
                >
                  <Badge
                    badgeContent={unreadCount}
                    color="error"
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

              {userRole === "ADMIN" && (
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

            {/* 알림 팝오버 */}
            <Popover
              id="notification-popover"
              open={openNotification}
              anchorEl={anchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{ mt: 1 }}
              PaperProps={{
                sx: {
                  width: 350,
                  maxHeight: 500,
                  overflowY: "auto",
                  borderRadius: 2,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                },
              }}
              disableScrollLock={true}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ p: 2, fontWeight: "bold", flexShrink: 0 }}
                >
                  📢 알림
                </Typography>
                <Divider />

                {notifications.length > 0 ? (
                  <List dense sx={{ flexGrow: 1, overflowY: "auto", p: 0 }}>
                    {renderNotificationGroup(
                      todayNotifications,
                      "오늘 받은 알림"
                    )}
                    {renderNotificationGroup(
                      previousNotifications,
                      "이전 알림"
                    )}
                    {isLoading && ( // 더 불러오는 중일 때 로딩 스피너 표시
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                        <CircularProgress size={20} />
                      </Box>
                    )}
                  </List>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      p: 2,
                      textAlign: "center",
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isLoading ? <CircularProgress size={20} /> : "새로운 알림이 없습니다."}
                  </Typography>
                )}

                <Divider />
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {hasMore && notifications.length > 0 && ( // 알림이 있을 때만 더보기 버튼 표시
                    <Button
                      variant="text"
                      size="small"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      sx={{
                        color: "text.secondary",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                        minWidth: "80px",
                      }}
                    >
                      {isLoading ? <CircularProgress size={16} /> : "더보기"}
                    </Button>
                  )}
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0 || isLoading} // 읽지 않은 알림이 없거나 로딩 중일 때 비활성화
                    sx={{
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        opacity: 0.65,
                      },
                    }}
                  >
                    모두 읽음
                  </Button>
                </Box>
              </Box>
            </Popover>
          </Toolbar>
        </AppBar>
      </Paper>
    </Box>
  );
}