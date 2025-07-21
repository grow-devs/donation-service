import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
})

// 응답 인터셉터: 재발급 받은(response) AccessToken 자동 셋팅
api.interceptors.response.use(
  (response) => {
    console.log(Object.keys(response.headers))

    const newAccessToken = response.headers['authorization']; 
    console.log('⭐ header authorization:', newAccessToken);
    if (newAccessToken) {
      const token = newAccessToken.replace('Bearer ', '');
      localStorage.setItem('accessToken', token);
      console.log('⭐️ new accessToken saved:', token);
    }
    return response;
  },
  (error) => {
    console.log('❌ response interceptor error:', error);
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
