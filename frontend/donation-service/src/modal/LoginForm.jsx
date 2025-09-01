// LoginForm.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../apis/api";
import useAuthStore from "../store/authStore";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({ onSwitchMode, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const setNickName = useAuthStore((state) => state.setNickName);
  const setUserRole = useAuthStore((state) => state.setUserRole);
  const setProfileImage = useAuthStore((state) => state.setProfileImage);

  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 8; // 최소 8자

  const canSubmit = isEmailValid && isPasswordValid && !loading;

  const handleLogin = async () => {
    setError("");
    // if (!canSubmit) {
    //   setError("이메일과 비밀번호를 확인해주세요.");
    //   return;
    // }
    setLoading(true);
    try {
      const res = await api.post("/user/login", { email, password });
      const accessToken = res.data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      login();
      console.log(res.data.data);
      setNickName(res.data.data.nickName);
      setUserRole(res.data.data.userRole);
      setProfileImage(res.data.data.profileImageUrl)
      onClose?.();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "이메일 또는 비밀번호가 올바르지 않습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        로그인
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        같이의 가치를 함께 만들어가요!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        size="small"
        margin="dense"
        fullWidth
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: "0.9rem",
            },
          },
        }}
        // helperText={!email ? '' : (isEmailValid ? '' : '올바른 이메일 형식을 입력하세요')}
      />

      <TextField
        size="small"
        margin="dense"
        fullWidth
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: "0.9rem",
            },
          },
        }}
        // helperText={password ? (isPasswordValid ? '' : '비밀번호는 최소 8자 이상이어야 합니다') : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, "&:hover": { backgroundColor:"#fc7979" },}}
        onClick={handleLogin}
        // disabled={!canSubmit}
        startIcon={loading ? <CircularProgress size={18} /> : null}
        
      >
        로그인
      </Button>

      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        mt={2}
        color="text.secondary"
        sx={{ cursor: "pointer" }}
        onClick={() => onSwitchMode("signup")}
      >
        아직 계정이 없으신가요? 회원가입
      </Typography>
    </Box>
  );
}
