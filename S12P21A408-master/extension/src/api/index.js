import axios from 'axios';

const api = axios.create({
  baseURL: 'https://j12a408.p.ssafy.io/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-From': 'extension',
  },
});

chrome.storage.local.get('accessToken', function (result) {
  api.interceptors.request.use((config) => {
    const token = result.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
});

let loginTabOpened = false; // 전역 상태 변수

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!loginTabOpened) {
        loginTabOpened = true;

        chrome.tabs.create({ url: 'https://j12a408.p.ssafy.io/login' }, () => {
          console.log('🔐 로그인 탭 열림');
        });

        // 일정 시간 후 플래그 초기화 (예: 로그인 안 했을 경우)
        setTimeout(() => {
          loginTabOpened = false;
        }, 10000); // 10초 후 다시 열 수 있게 허용
      } else {
        console.log('🚫 이미 로그인 탭 열림');
      }
    }

    return Promise.reject(error);
  },
);

export default api;
