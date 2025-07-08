// src/apis/api.js
import axios from 'axios'
import { refreshAccessToken } from './tokenHelper'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: AccessToken 자동 첨부
api.interceptors.request.use((config) => {
  const excludedPaths = ['/user/login', '/user/signup', '/user/reissue'];
  const shouldExclude = excludedPaths.some((path) => config.url.includes(path));

  if (!shouldExclude) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

// 응답 인터셉터: 401 → RefreshToken으로 재발급 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      const newAccessToken = await refreshAccessToken()

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest) // 요청 재시도
      }
    }

    return Promise.reject(error)
  }
)

export default api
