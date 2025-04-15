import api from '../api';

export const getHighlights = async (url, onSuccess, onError) => {
  chrome.storage.local.get('accessToken', (response) => {
    fetch(`https://j12a408.p.ssafy.io/api/archives/detail?url=${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${response.accessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (onSuccess) {
          onSuccess(data.content);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch highlights:', error);
        if (onError) {
          onError(error);
        }
      });
  });

  // api
  //   .get('/archives/detail', { params })
  //   .then((response) => {
  //     if (onSuccess) {
  //       onSuccess(response.data.content);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error('Failed to fetch highlights not success:', error);
  //     if (onError) {
  //       onError(error);
  //     }
  //   });
};

export const deleteHighlight = async (highlightId, onSuccess, onError) => {
  api
    .delete(`/highlights/${highlightId}`)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to delete highlight:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const saveMemo = async (highlightId, memo, onSuccess, onError) => {
  api
    .post(`/highlights/${highlightId}/memos`, { content: memo })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to add memo:', error);
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
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to delete memo:', error);
      if (onError) {
        onError(error);
      }
    });
};

export const updateMemo = async (highlightId, memoId, memo, onSuccess, onError) => {
  api
    .patch(`/highlights/${highlightId}/memos/${memoId}`, { content: memo })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data.content);
      }
    })
    .catch((error) => {
      console.error('Failed to update memo:', error);
      if (onError) {
        onError(error);
      }
    });
};
