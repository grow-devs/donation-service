// src/apis/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 재시도 횟수를 추적하여 무한 재시도를 방지하는 변수
let retryCount = 0;
const MAX_RETRY = 3;

// 응답 인터셉터: 토큰이 만료되었을때 서버에서 새로운 토큰을 받아 요청을 재시도
api.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers['authorization'];
    
    // 1. 서버 응답 헤더에 새로운 AccessToken이 포함된 경우
    if (newAccessToken) {
      const token = newAccessToken.replace('Bearer ', '');
      localStorage.setItem('accessToken', token);
      console.log('⭐️ New AccessToken saved:', token);

      // 2. 재발급된 토큰으로 원래 요청을 재시도
      // (기존 요청 설정(originalRequest)을 가져와 새 토큰으로 헤더를 업데이트)
      const originalRequest = response.config;
      originalRequest.headers['Authorization'] = `Bearer ${token}`;
      
      // 3. 재시도 횟수 확인 (무한 루프 방지)
      if (retryCount < MAX_RETRY) {
        retryCount++;
        console.log(`Retrying original request... (Attempt: ${retryCount})`);
        return api(originalRequest); // 재시도
      } else {
        console.error('Max retry count reached. Please log in again.');
        // 무한 재시도를 막기 위해 에러 처리
        return Promise.reject(new Error('Max retry count reached.'));
      }
    }

    // 새로운 토큰이 없으면 정상 응답 처리
    retryCount = 0; // 성공적으로 응답을 받으면 재시도 카운트 초기화
    return response;
  },
  (error) => {
    // 서버가 401 에러를 반환하는 경우에 대한 처리 (선택사항)
    if (error.response.status === 401) {
      console.error('❌ Authentication failed. Please log in again.');
      // // 로그인 페이지로 리디렉션
      // window.location.href = '/login';
    }
    retryCount = 0; // 에러 발생 시 재시도 카운트 초기화
    return Promise.reject(error);
  }
);


// 요청 인터셉터: AccessToken 자동 첨부
api.interceptors.request.use((config) => {
  const excludedPaths = ['/user/login', '/user/signup'];
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


export default api
