// src/components/ApprovalStatusModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

// 모달 타입에 따라 색상과 텍스트를 결정하는 헬퍼 함수
const getModalInfo = (type) => {
  if (type === 'ACCEPTED') {
    return { title: '승인 요청', confirmText: '수락', color: 'success' };
  }
  if (type === 'REJECTED') {
    return { title: '거절 요청', confirmText: '거절', color: 'error' };
  }
  return { title: '', confirmText: '', color: 'primary' };
};

export default function ApprovalStatusModal({
  isOpen,
  onClose,
  onConfirm,
  modalType, // 'ACCEPTED' 또는 'REJECTED'
}) {
  const [message, setMessage] = useState('');
  const { title, confirmText, color } = getModalInfo(modalType);

  // 모달이 열릴 때마다 메시지 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setMessage('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(message);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="approval-status-modal-title"
      aria-describedby="approval-status-modal-description"
    >
      <Box sx={style}>
        <Typography id="approval-status-modal-title" variant="h6" component="h2" mb={2}>
          {title}
        </Typography>
        <Typography id="approval-status-modal-description" sx={{ mt: 2, mb: 2 }}>
          {`해당 신청을 ${confirmText} 하시겠습니까? 사유를 입력해주세요.`}
        </Typography>
        <TextField
          label="메시지 입력"
          multiline
          rows={4}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="contained"
            color={color}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}