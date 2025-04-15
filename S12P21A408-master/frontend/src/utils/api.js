// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'https://j12a408.p.ssafy.io/api';

// API 기본 객체 정의
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios 인스턴스 생성
// 쿠키에서 토큰 가져오는 함수
const getAccessToken = () => {
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find((row) => row.startsWith('accessToken='));
  console.log('토큰 쿠키:', tokenCookie);
  return tokenCookie ? `Bearer ${tokenCookie.split('=')[1]}` : '';
};

// 요청 인터셉터에서 동적으로 토큰 설정
api.interceptors.request.use(
  (config) => {
    console.log('api.js - 요청 인터셉터 전체 쿠키:', document.cookie);
    const token = getAccessToken();
    console.log('api.js - 요청 인터셉터 추출된 토큰:', token);

    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 요청 인터셉터 추가 (로깅 및 요청 전 처리)
api.interceptors.request.use(
  (config) => {
    console.log(`요청: ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error('요청 전 오류:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터 추가 (로깅 및 401 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 오류 처리
    if (error.response && error.response.status === 401) {
      console.error('인증 오류 발생: 401 Unauthorized');
      // 리다이렉트 전에 비동기 작업을 완료하도록 잠시 지연
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }

    // 에러 로깅 및 처리
    console.error('API 요청 중 오류:', error.response ? error.response.data : error.message);

    return Promise.reject(error);
  },
);

export default api;
