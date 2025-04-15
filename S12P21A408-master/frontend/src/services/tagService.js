import api from '../utils/api';

export const getAllTags = async (onSuccess, onError) => {
  api
    .get('/tags/all')
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Error fetching tags:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const getHierarchicalTags = async (onSuccess, onError) => {
  api
    .get('/tags/hierarchical')
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Error fetching hierarchical tags:', error);
      if (onError) {
        onError(error);
      }
    });
};

// 태그TOP10 - 전체
export const getTopTags = async (params, onSuccess, onError) => {
  api
    .get('/tags/top', { params })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Error fetching top tags:', error);
      if (onError) {
        onError(error);
      }
    });
};
