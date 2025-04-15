import { create } from 'zustand';
import { addHistories } from '../services/recommendService';
import { getMyInfo } from '../services/authService';

const useAuthStore = create((set) => ({
  pageInfo: {
    url: '',
    title: '',
    icon: '',
  },

  hasVisitRecord: null,

  setPageInfo: (pageInfo) => set({ pageInfo }),
  setVisitRecord: (hasVisitRecord) => set({ hasVisitRecord }),

  postHistories: async (historyData) => {
    getMyInfo(
      (response) => {
        set({ hasVisitRecord: response.hasVisitRecord });
        if (!response.hasVisitRecord) {
          addHistories(
            historyData.map((item) => {
              return transformHistoryItem(item);
            }),
            () => {
              chrome.storage.sync.set({ hasVisitRecord: true }, () => {
                set({ hasVisitRecord: true });
              });
            },
            (error) => {
              console.error('Error adding history data:', error);
            },
          );
        }
      },
      (error) => {
        console.error('Error fetching my info:', error);
      },
    );
  },
}));

function transformHistoryItem(item) {
  const date = new Date(item.lastVisitTime);
  const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);

  return {
    url: item.url,
    title: item.title,
    timestamp: formattedDate,
  };
}

export default useAuthStore;
