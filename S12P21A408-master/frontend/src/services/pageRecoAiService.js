import aiApi from '../utils/aiApi';

export const getRecommendPages = async (params, onSuccess, onError) => {
  console.log('[service] API 호출 시작:', params); // 🔥 반드시 있어야 함

  // ✅ 직접 쿼리스트링 생성
  const query = new URLSearchParams();
  if (params.platform) query.set('platform', params.platform);
  if (params.offset !== undefined) query.set('offset', params.offset);
  if (Array.isArray(params.keywords)) {
    params.keywords.forEach((kw) => {
      if (!kw) return;
      const keywordValue = kw.keyword || kw.name; // `keyword`가 없으면 `name` 사용
      query.append('keywords', keywordValue);
    });
  }

  const url = `/main/recommendations?${query.toString()}`;

  aiApi
    // .get('/main/recommendations', { params })
    .get(url)
    .then((response) => {
      console.log('[페이지 추천 API 응답 data]', response.content);
      if (onSuccess) {
        onSuccess(response.content);
      }
    })
    .catch((error) => {
      console.error('Error fetching recommendPages', error);
      if (onError) {
        onError(error);
      }
    });
};
