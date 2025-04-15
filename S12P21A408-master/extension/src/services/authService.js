import api from '../api';

export const getMyInfo = async (onSuccess, onError) => {
  api
    .get('/member/me')
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch highlights not success:', error);
      if (onError) {
        onError(error);
      }
    });
};
