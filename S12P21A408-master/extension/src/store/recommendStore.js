import { create } from 'zustand';
import { getRecommend } from '../services/recommendService';
import { getMyInfo } from '../services/authService';

const useRecommendStore = create((set) => ({
  isRecommend: null,
  recommends: [
    {
      thumbnail: '',
      title: '',
      link: '',
    },
  ],
  keyword: '',

  historyError: false,

  fetchRecommend: async (url) => {
    getMyInfo(
      (response) => {
        if (!response.hasVisitRecord) {
          set({ historyError: true });
        } else {
          getRecommend(
            { url: url },
            (data) => {
              console.log('Fetched recommend:', data);
              if (data && data.recommendations && data.keyword) {
                set({ recommends: data.recommendations });
                set({ keyword: data.keyword });
                set({ isRecommend: true });
              } else {
                set({ isRecommend: false });
              }
            },
            (error) => {
              console.error('Failed to fetch recommend:', error);
              set({ isRecommend: false });
            },
          );
          chrome.storage.sync.set({ hasVisitRecord: true }, () => {
            console.log('✅ hasVisitRecord saved in chrome.storage.sync');
          });
        }
      },
      (error) => {
        console.error('Error fetching my info:', error);
        set({ isRecommend: false });
      },
    );
  },
}));

export default useRecommendStore;
