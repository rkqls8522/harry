import api from '../utils/api';
import qs from 'qs';

export const getArchives = async (params, onSuccess, onError) => {
  api
    .get('/archives', { params, paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }) })
    .then((response) => {
      console.log('[API 응답 data]', response.data.content);
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Error fetching archives:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const searchArchives = async (params, onSuccess, onError) => {
  api
    .get('/archives/search', { params })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Error fetching archives:', error);
      if (onError) {
        onError(error);
      }
    });
};
