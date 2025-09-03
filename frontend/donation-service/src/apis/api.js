// src/apis/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 응답 인터셉터: 토큰 갱신 로직 (핵심)
api.interceptors.response.use(
  (response) => {
    // 성공적인 응답일 경우, 불필요한 로직 없이 바로 반환
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러를 받았고, 재시도 플래그가 없는 경우
    if (error.response.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      try {
        // 1. 재발급 엔드포인트에 요청 (HttpOnly 쿠키 자동 전송)
        const response = await refreshApi.get("/refresh");

        // 2. 응답 헤더에서 새 AccessToken 추출 및 저장
        const newAccessToken = response.headers.authorization.split(" ")[1];
        localStorage.setItem("accessToken", newAccessToken);

        // 3. 원래 요청의 헤더를 새 AccessToken으로 갱신
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 4. 원래 요청을 재시도
        return api(originalRequest);
      } catch (refreshError) {
        // 5. Refresh Token 갱신 실패 (예: Refresh Token도 만료됨)
        localStorage.clear();
        // ✅ alert를 띄운 후 메인 페이지로 리디렉션
        window.alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// 요청 인터셉터: AccessToken 자동 첨부
api.interceptors.request.use((config) => {
  const excludedPaths = ["/user/login", "/user/signup"];
  const shouldExclude = excludedPaths.some((path) => config.url.includes(path));

  if (!shouldExclude) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

// 응답 인터셉터: 401 → RefreshToken으로 재발급 시도

export default api;
