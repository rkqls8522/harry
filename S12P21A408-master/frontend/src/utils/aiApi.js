// src/utils/aiApi.js
import axios from 'axios';

const AI_BASE_URL = 'https://j12a408.p.ssafy.io/ai';

// 쿠키에서 토큰 가져오는 함수
const getAccessToken = () => {
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find((row) => row.startsWith('accessToken='));
  return tokenCookie ? `Bearer ${tokenCookie.split('=')[1]}` : '';
};

// AI 전용 Axios 인스턴스 생성
const aiClient = axios.create({
  baseURL: AI_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
aiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 설정
aiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('AI API 요청 중 오류:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  },
);

// AI API 객체 정의
const aiApi = {
  async get(endpoint, options = {}) {
    return aiClient({
      url: endpoint,
      method: 'GET',
      ...options,
    });
  },

  async post(endpoint, data, options = {}) {
    return aiClient({
      url: endpoint,
      method: 'POST',
      data,
      ...options,
    });
  },

  async put(endpoint, data, options = {}) {
    return aiClient({
      url: endpoint,
      method: 'PUT',
      data,
      ...options,
    });
  },

  async delete(endpoint, options = {}) {
    return aiClient({
      url: endpoint,
      method: 'DELETE',
      ...options,
    });
  },
};

export { aiApi, aiClient as default };
