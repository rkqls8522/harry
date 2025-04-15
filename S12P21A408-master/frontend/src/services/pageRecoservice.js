import api from '../utils/api';

export const getKeywords = async (onSuccess, onError) => {
  api
    .get('/recommend/keywords')
    .then((response) => {
      console.log('[키워드 가져오기 API 응답 data]', response.data.content);
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Error fetching keywords:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const getAllKeywords = async (onSuccess, onError) => {
  api
    .get('/recommend/keywords/all')
    .then((response) => {
      if (response.data?.content?.keywords) {
        onSuccess(response.data.content.keywords);
      } else {
        onError(new Error('키워드 데이터가 없습니다'));
      }
    })
    .catch((error) => {
      console.error('키워드 가져오기 실패:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const getPlatforms = async (onSuccess, onError) => {
  api
    .get('/recommend/platforms')
    .then((response) => {
      console.log('[플랫폼 가져오기 API 응답 data]', response.data.content);
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Error fetching platforms:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const getAllPlatforms = async (onSuccess, onError) => {
  api
    .get('/recommend/platforms/all')
    .then((response) => {
      console.log('[모든 플랫폼 가져오기 API 응답 data]', response.data.content);
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Error fetching all platforms:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const insertPlatform = async (platformId, onSuccess, onError) => {
  api
    .get(`/recommend/platforms/${platformId}`)
    .then((response) => {
      console.log('[플랫폼 추가하기 API 응답 data]', response.data.content);
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Error inserting platform:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const deletePlatform = async (platformId, onSuccess, onError) => {
  api
    .delete(`/recommend/platforms/${platformId}`)
    .then((response) => {
      console.log('[플랫폼 삭제하기 API 응답 data]', response.data.status.message);
      if (onSuccess) {
        onSuccess(response.data.status.message);
      }
    })
    .catch((error) => {
      console.error('Error deleting platform:', error);
      if (onError) {
        onError(error);
      }
    });
};
