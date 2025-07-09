
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Diversity1SharpIcon from '@mui/icons-material/Diversity1Sharp';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ForestIcon from '@mui/icons-material/Forest';
import PetsIcon from '@mui/icons-material/Pets';
import ElderlyIcon from '@mui/icons-material/Elderly';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PublicIcon from '@mui/icons-material/Public';
import AccessibleIcon from '@mui/icons-material/Accessible';
import { Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function MainCategory() {
  const navigate = useNavigate();
  const categories = [
    { label: '전체', icon: <Diversity1SharpIcon /> },
    { label: '아동', icon: <ChildCareIcon /> },
    { label: '환경', icon: <ForestIcon /> },
    { label: '동물', icon: <PetsIcon /> },
    { label: '어르신', icon: <ElderlyIcon /> },
    { label: '사회', icon: <Diversity3Icon /> },
    { label: '지구', icon: <PublicIcon /> },
    { label: '장애인', icon: <AccessibleIcon /> },
  ];

  return (
    
    <Card
      elevation={1}
      sx={{
        borderRadius: 4,
        flexDirection: 'column',  
        display: 'flex',
        overflowX: 'auto',
        gap: 1,
        px: 2,
        py: 1,
        alignItems: 'center',
        // mt: 2,
      }}
    >
       <Typography variant="subtitle1" fontWeight="500">
        관심있는 모금함에 들어가보세요!
      </Typography>

    <Box
        component="nav"
        sx={{
          display: 'flex',
          flexDirection: 'row',     // 2) 아이콘만 가로로
          flexWrap: 'nowrap',       // 한 줄로 쭉
          overflowX: 'auto',        // 넘칠 땐 스크롤
          gap: 1,
          alignItems: 'center',
        }}
      >
        {categories.map((cat, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 60,
            }}
          >
            <IconButton
              sx={{
                bgcolor: 'primary.light',
                color: 'white',
                mb: 0.5,
                '&:hover': { bgcolor: 'primary.main' },
                width: 50,
                height: 50,
                borderRadius: '50%',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                transition: 'background-color 0.3s ease',
              }}
                  onClick={() => navigate('/postList')}

            >
              {cat.icon}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {cat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>

  );
}
