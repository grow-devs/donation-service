
import React from 'react'
import { Card, Box, Typography } from '@mui/material'

export default function TotalAmount({ totalDonation }) {
  const total = Number(totalDonation);
    return (
    <Card
    sx={{
        bgcolor:'rgb(252, 226, 76)',
        width: 360,                 // 카드 전체 너비 고정
        display: 'flex',
        flexDirection: 'column',    // 세로로 쌓기
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        p: 2,
      }}
    >
      {/* ───────── 1번 영역 (텍스트 + 이미지) ───────── */}
      <Box
        sx={{
          flex: 3,                  // 2번보다 3배 크기
          display: 'flex',
          alignItems: 'center',
          mb: 2,                    // 아래 2번 영역과 간격
        }}
      >
        {/* 1-1) 텍스트 */}
        <Box
          sx={{
            flex: 1,                // 남는 공간 다 차지
            minWidth: 0,            // flex 아이템 줄어들도록
          }}
        >
          <Typography
            variant="subtitle1"
                            // 한 줄로 자르고
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            함께하는 기부로 <br/> 더 나은 세상을 만듭니다.
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            (2025-06-30 기준)
          </Typography>
        </Box>

        {/* 1-2) 이미지 */}
        <Box
          component="img"
          src="src\assets\react.svg"
          alt="Donation"
          sx={{
            width: 80,
            height: 90,
            // borderRadius: 2,
            // objectFit: 'cover',
            // // flexShrink: 0,          // 이미지가 줄어들지 않음
            // ml: 1,
          }}
        />
      </Box>

      {/* ───────── 2번 영역 (“총 기부금” 카드) ───────── */}
      <Box
        sx={{
          flex: 1,                  // 1번보다 작게
          bgcolor: 'rgba(255,255,255,0.2)',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          총 기부금
        </Typography>
        <Typography variant="h5" fontWeight={700}>
           {total.toLocaleString()}원
        </Typography>
      </Box>
            </Card>
  )
}