
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Badge } from '@mui/material';

export default function MainAppBar() {
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
        px: { xs: '4%', sm: '8%' },
      }}
    >
      <AppBar
        position="static"
        color="inherit"
        sx={{
          borderRadius: 3,
          boxShadow: 'none',
          backgroundColor: '#ffffff',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            /* 툴바 내부도 반응형 px  */
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* 왼쪽: 서비스 이름 (항상 보임) */}
          <Typography variant="h5" fontWeight="bold" color="primary">
            같이가치
          </Typography>

          {/* 가운데: 문구 → sm 미만일 땐 숨김 */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontStyle: 'normal',
              fontSize: '1rem',
              display: { xs: 'none', sm: 'block' },  // 핵심!
            }}
          >
            함께 살아가는 우리 기부 플랫폼과 함께하세요
          </Typography>

          {/* 오른쪽: 아이콘 */}
          <Box>
            <IconButton
              size="large"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
                mx: 0.5,
              }}
            >
              {/* 알림 뱃지 */}
              <Badge badgeContent={100} color="primary"  sx={{
                          '& .MuiBadge-badge': {
                            fontStyle: 'normal',       // ← 여기!
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            color : "rgba(0, 0, 0, 0.7)",
                            px: 1,
                          },
                        }}>
                <NotificationsIcon />
              </Badge>
                
            </IconButton>
            <IconButton
              size="large"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
                mx: 0.5,
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Paper>
  );
}