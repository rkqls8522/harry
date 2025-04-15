import api from '../api';

export const getTagsHistory = async (onSuccess, onError) => {
  api
    .get('/tags/history')
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch highlight tags:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const getAITags = async (archiveId, onSuccess, onError) => {
  api
    .get(`/recommend/tag/${archiveId}`)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch AI tags:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const saveTag = async (archiveId, tag, onSuccess, onError) => {
  const isHierarchical = tag.includes('/');
  api
    .post(`/archives/${archiveId}/tags`, { name: tag, isHierarchical })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to save highlight tag:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const deleteTag = async (tagId, onSuccess, onError) => {
  api
    .delete(`/tags/${tagId}`)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Failed to delete highlight tag:', error);
      if (onError) {
        onError(error);
      }
    });
};
