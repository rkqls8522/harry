import api from '../utils/api';

export const getArchiveDetail = async (archiveId, onSuccess, onError) => {
  api
    .get(`/archives/${archiveId}`)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Error fetching archive detail:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const deleteHighlight = async (highlightId, onSuccess, onError) => {
  api
    .delete(`/highlights/${highlightId}`)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Error deleting highlight:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const saveMemo = async (highlightId, value, onSuccess, onError) => {
  api
    .post(`/highlights/${highlightId}/memos`, { content: value })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Error adding memo:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const updateMemo = async (highlightId, memoId, value, onSuccess, onError) => {
  api
    .patch(`/highlights/${highlightId}/memos/${memoId}`, { content: value })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Error updating memo:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const deleteMemo = async (highlightId, memoId, onSuccess, onError) => {
  api
    .delete(`/highlights/${highlightId}/memos/${memoId}`)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Error deleting memo:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const saveNote = async (archiveId, value, onSuccess, onError) => {
  api
    .post(`/archives/${archiveId}/note`, { note: value })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Error adding note:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const updateNote = async (archiveId, value, onSuccess, onError) => {
  api
    .patch(`/archives/${archiveId}/note`, { content: value })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Error updating note:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const deleteNote = async (archiveId, onSuccess, onError) => {
  api
    .delete(`/archives/${archiveId}/note`)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Error deleting note:', error);
      if (onError) {
        onError(error);
      }
    });
};

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
