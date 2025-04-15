import { create } from 'zustand';
import { getRecommendPages } from '../services/pageRecoAiService';

const pageRecommendStore = create((set, get) => ({
  pages: [],
  isLoading: false,
  selectedKeywords: [],
  selectedPlatform: null,
  offset: 0,

  // TODO: 선택된 키워드로 백엔드 API 연동
  setSelectedKeywords: (newKeywords) => {
    // TODO: 선택된 키워드로 백엔드 API 연동
    const { selectedPlatform, fetchRecommendPages } = get();
    set({ offset: 0, isLoading: true });

    if (newKeywords.length === 0) {
      set({ selectedKeywords: newKeywords, isLoading: false });
      return;
    }

    // 이전과 같은 키워드가 선택될 경우 API 요청을 건너뜀
    // const isSame =
    //   selectedKeywords.length === newKeywords.length &&
    //   selectedKeywords.every((keyword) => newKeywords.some((newKeyword) => keyword.id === newKeyword.id)) &&
    //   newKeywords.every((newKeyword) => selectedKeywords.some((keyword) => keyword.id === newKeyword.id));

    // if (isSame) {
    //   console.log('선택된 키워드가 이전과 같아 요청을 건너뜁니다.');
    //   return;
    // }

    console.log('setSelectedKeywords', newKeywords);

    set({ selectedKeywords: newKeywords });

    if (!selectedPlatform) {
      console.warn('선택된 플랫폼이 없어 요청을 보낼 수 없습니다.');
      return;
    }

    fetchRecommendPages({ platform: selectedPlatform || 'all', offset: 0, keywords: newKeywords });
  },

  // TODO: 선택된 키워드로 백엔드 API 연동
  setSelectedPlatform: (newPlatform) => {
    // TODO: 선택된 플랫폼으로 백엔드 API 연동
    const { selectedKeywords, selectedPlatform, fetchRecommendPages } = get();

    // newPlatform이 비었는지 확인
    if (!newPlatform) {
      set({ isLoading: false });
      return;
    }
    // 이전과 같은 플랫폼이 선택될 경우 API 요청을 건너뜀
    if (selectedPlatform === newPlatform) {
      console.log('선택된 플랫폼이 이전과 같아 요청을 건너뜁니다.');
      return;
    }

    set({ selectedPlatform: newPlatform });
    console.log('setSelectedPlatform', selectedPlatform);

    if (selectedKeywords.length === 0) {
      console.warn('선택된 키워드가 없어 요청을 보낼 수 없습니다.');
      return;
    }

    fetchRecommendPages({ platform: newPlatform, offset: 0, keywords: selectedKeywords || [] });
  },

  nextPage: () => {
    const { offset, isLoading, selectedPlatform, selectedKeywords, fetchRecommendPages } = get();
    const nextOffset = offset + 8;

    if (isLoading) return;

    set({ offset: nextOffset, isLoading: true });

    fetchRecommendPages({
      platform: selectedPlatform,
      offset: nextOffset,
      keywords: selectedKeywords,
    });
  },

  fetchRecommendPages: async ({ platform, offset, keywords }, callback) => {
    if (platform === null || !Array.isArray(keywords) || keywords.length === 0) {
      console.warn('🚫 플랫폼이나 키워드가 없어 요청을 중단합니다.');
      set({ isLoading: false });
      if (callback) callback(null, []);
      return;
    }
    set({ isLoading: true });
    const params = {
      platform,
      offset,
      keywords,
    };

    getRecommendPages(
      params,

      (data) => {
        const pages = Array.isArray(data) ? data : []; // 배열이 아닐 경우 대비
        set((state) => ({
          pages: offset === 0 ? pages : [...state.pages, ...pages],
          isLoading: false,
        }));
        if (callback) callback(null, data);
      },

      (error) => {
        console.error('Error fetching pageRecommend:', error);
        set({ isLoading: false });

        if (callback) callback(error, null);
      },
    );
  },

  // 페이지 업데이트 함수
  setPages: (newPages) => {
    set({ pages: newPages });
  },
}));

export default pageRecommendStore;
