import axios from 'axios';

const aiApi = axios.create({
  baseURL: 'https://j12a408.p.ssafy.io/ai',
  headers: {
    'Content-Type': 'application/json',
  },
});

chrome.storage.local.get('accessToken', function (result) {
  aiApi.interceptors.request.use((config) => {
    const token = result.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
});

export const getRecommend = async (data, onSuccess, onError) => {
  aiApi
    .post('/recommendations', JSON.stringify(data))
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch recommend:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const addHistories = async (data, onSuccess, onError) => {
  aiApi
    .post('/histories/keywords', JSON.stringify(data))
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch recommend:', error);
      if (onError) {
        onError(error);
      }
    });
};
