import api from '../utils/api';

export const getScraps = async (params, onSuccess, onError) => {
  api
    .get('/scraps', { params })
    .then((response) => {
      console.log('[/scrap GET api data: ]', response.data.content);
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Error fetching scraps:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const updateScrapIsRead = async (scrapId, value, onSuccess, onError) => {
  api
    .post(`/scraps/${scrapId}`, { isRead: value })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      if (onError) {
        onError(error);
      }
    });
};
