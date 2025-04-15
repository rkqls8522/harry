import api from '../../utils/api';

export const getMember = (onSuccess, onError) => {
  console.log('회원 정보 요청 중...');
  api
    .get('/member/me')
    .then((response) => {
      console.log('회원 정보 응답:', response.data);
      onSuccess(response.data);
    })
    .catch((error) => {
      console.error('회원 정보 요청 오류:', error);
      onError(error);
      throw error;
    });
};
