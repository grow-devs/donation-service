import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../apis/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// API 요청 함수
const sendEmailVerification = (email) => api.post("/user/send-code", { email });
const verifyEmailCode = (email, code) =>
  api.post("/user/verify-code", { email, code });
const checkNickname = (nickName) =>
  api.get("/user/check-nickname", { params: { nickName } });
const signupUser = (payload) => api.post("/user/signup", payload);

export default function SignupForm({ onSwitchMode }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    nickName: "",
    userRole: "USER",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 이메일 인증
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  // 닉네임 중복 확인
  const [nickAvailable, setNickAvailable] = useState(null);
  const [isCheckingNick, setIsCheckingNick] = useState(false);

  // 비밀번호 표시
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startResendTimer = (seconds = 180) => {
    setSecondsLeft(seconds);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setIsEmailSent(false);
      setIsEmailVerified(false);
      setEmailCode("");
    }
    if (name === "nickName") {
      setNickAvailable(null);
    }
  };

  const handleSendVerification = async () => {
    if (!emailRegex.test(form.email)) {
      setError("올바른 이메일을 입력하세요.");
      return;
    }
    setSendLoading(true);
    setError("");
    try {
      await sendEmailVerification(form.email);
      setIsEmailSent(true);
      startResendTimer();
    } catch (e) {
      setError(e.response?.data?.message || "인증 코드 전송 실패");
    } finally {
      setSendLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setVerifyLoading(true);
    setError("");
    try {
      const res = await verifyEmailCode(form.email, emailCode);
      if (res.data) {
        setIsEmailVerified(true);
      } else {
        setError("인증 코드가 올바르지 않습니다.");
        setIsEmailVerified(false);
      }
    } catch (e) {
      setError(e.response?.data?.message || "인증 실패");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleCheckNickname = async () => {
    if (!form.nickName) {
      setNickAvailable(false);
      return;
    }
    setIsCheckingNick(true);
    try {
      const res = await checkNickname(form.nickName);
      setNickAvailable(Boolean(!res.data)); // API 반환값에 따라 수정 필요
    } catch (error) {
      setNickAvailable(false);
    } finally {
      setIsCheckingNick(false);
    }
  };

  const canSignup =
    isEmailVerified &&
    passwordRegex.test(form.password) &&
    form.password === form.confirmPassword &&
    form.userName.trim() !== "" &&
    nickAvailable === true &&
    !loading;

  const handleSignup = async () => {
    if (!canSignup) {
      setError("입력값을 확인하세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signupUser(form);
      alert("회원가입 성공");
      onSwitchMode("login");
    } catch (e) {
      setError(e.response?.data?.message || "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        회원가입
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        필요한 정보를 입력해주세요.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {error}
        </Alert>
      )}

    {/* 이메일 입력 + 인증요청 버튼 */}
{!isEmailVerified && (
  <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
    <Grid item xs={8}>
      <TextField
        size="small"
        fullWidth
        label="이메일"
        name="email"
        value={form.email}
        onChange={handleChange}
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: "0.9rem",
            },
          },
        }}
      />
    </Grid>
    <Grid item xs={4}>
      <Button
        variant="outlined"
        fullWidth
        onClick={handleSendVerification}
        disabled={
          sendLoading || secondsLeft > 0 || !emailRegex.test(form.email)
        }
      >
        {sendLoading ? (
          <CircularProgress size={16} />
        ) : secondsLeft > 0 ? (
          `재전송(${secondsLeft}s)`
        ) : (
          "인증요청"
        )}
      </Button>
    </Grid>
  </Grid>
)}

{/* 인증 코드 입력 */}
{isEmailSent && !isEmailVerified && (
  <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
    <Grid item xs={8}>
      <TextField
        size="small"
        fullWidth
        label="인증 코드"
        value={emailCode}
        onChange={(e) => setEmailCode(e.target.value)}
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: "0.9rem",
            },
          },
        }}
      />
    </Grid>
    <Grid item xs={4}>
      <Button
        variant="contained"
        fullWidth
        onClick={handleVerifyCode}
        disabled={verifyLoading || !emailCode}
      >
        {verifyLoading ? <CircularProgress size={16} /> : "확인"}
      </Button>
    </Grid>
  </Grid>
)}

{isEmailVerified && (
  <FormHelperText sx={{ color: "success.main", mb: 2 }}>
    이메일 인증 완료 ✅
  </FormHelperText>
)}
      {/* 비밀번호 */}
      <TextField
        size="small"
        fullWidth
        label="비밀번호"
        name="password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        sx={{ mb: 1.5 }}
        helperText={
          form.password && !passwordRegex.test(form.password)
            ? "영문+숫자 8자 이상"
            : ""
        }
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: "0.9rem",
            },
          },
        }}
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

      {/* 비밀번호 확인 */}
      <TextField
        size="small"
        fullWidth
        label="비밀번호 확인"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        sx={{ mb: 1.5 }}
        helperText={
          form.confirmPassword && form.password !== form.confirmPassword
            ? "비밀번호 불일치"
            : ""
        }
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: "0.9rem",
            },
          },
        }}
      />

      {/* 이름 */}
      <TextField
        size="small"
        fullWidth
        label="이름"
        name="userName"
        value={form.userName}
        onChange={handleChange}
        sx={{ mb: 1.5 }}
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: "0.9rem",
            },
          },
        }}
      />

      {/* 닉네임 */}
      <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Grid item xs={8}>
          <TextField
            size="small"
            fullWidth
            label="닉네임"
            name="nickName"
            value={form.nickName}
            onChange={handleChange}
            error={nickAvailable === false}
            slotProps={{
              inputLabel: {
                sx: {
                  fontSize: "0.9rem",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleCheckNickname}
            disabled={!form.nickName || isCheckingNick}
          >
            {isCheckingNick ? <CircularProgress size={16} /> : "중복확인"}
          </Button>
        </Grid>
      </Grid>
      {nickAvailable === false && (
        <FormHelperText error sx={{ mb: 1}}>
          이미 사용 중이거나 유효하지 않은 닉네임입니다. ❌
        </FormHelperText>
      )}
      {nickAvailable === true && (
        <FormHelperText sx={{ color: "success.main", mb: 1}}>
          사용 가능한 닉네임입니다. ✅
        </FormHelperText>
      )}
      {/* 권한은 필요한 경우 주석을 풀고 가입하기 */}
      {/* 권한
      <TextField
        size="small"
        fullWidth
        select
        SelectProps={{ native: true }}
        label="권한"
        name="userRole"
        value={form.userRole}
        onChange={handleChange}
        sx={{ mb: 1.5 }}
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: "0.9rem",
            },
          },
        }}
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </TextField> */}

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 1 }}
        onClick={handleSignup}
        disabled={!canSignup}
      >
        {loading ? <CircularProgress size={18} /> : "가입하기"}
      </Button>

      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        mt={2}
        color="text.secondary"
        sx={{ cursor: "pointer" }}
        onClick={() => onSwitchMode("login")}
      >
        이미 계정이 있으신가요? 로그인
      </Typography>
    </Box>
  );
}
