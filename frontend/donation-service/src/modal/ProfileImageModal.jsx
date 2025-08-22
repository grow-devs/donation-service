// src/modal/ProfileImageModal.jsx

import React from 'react';
import { 
    Modal, 
    Box, 
    Typography, 
    Button, 
    Stack 
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ProfileImageModal = ({ isOpen, onClose, onSave, previewImage }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="profile-image-modal-title"
    >
      <Box sx={style}>
        <Typography id="profile-image-modal-title" variant="h6" component="h2" mb={2}>
          프로필 이미지 변경
        </Typography>
        
        {/* 이미지 미리보기 */}
        {previewImage && (
          <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2 
            }}>
            <img 
                src={previewImage} 
                alt="미리보기" 
                style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px', 
                    borderRadius: '8px' 
                }} 
            />
          </Box>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            onClick={onClose} 
            variant="outlined"
            color="error"
          >
            취소
          </Button>
          <Button 
            onClick={onSave} 
            variant="contained"
            color="primary"
          >
            저장
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ProfileImageModal;