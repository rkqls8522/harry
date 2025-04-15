import api from '../api';

export const getScraps = () => {
  return api.get('/scraps');
};

export const saveScrap = async (data, onSuccess, onError) => {
  api
    .post('/scraps', data)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to save scrap:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const getScrap = async (params, onSuccess, onError) => {
  api
    .get('/scraps/detail', { params })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch scrap status:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const updateRead = (id, data) => {
  return api.post(`/scraps/${id}`, data);
};

export const deleteScrap = (id) => {
  return api.delete(`/scraps/${id}`);
};
