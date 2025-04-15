import { create } from 'zustand';
import { saveScrap, updateRead, getScrap } from '../services/scrapService';

const useScrapStore = create((set) => ({
  scrapPageInfo: {
    id: null,
    title: '사방팔방 화이팅',
    url: 'http://j12a408.p.ssafy.io/',
    image: null,
    tags: [],
    isRead: false,
    isNotified: false,
  }, // 초기 상태

  icon: '',

  setScrapPageInfo: (info) => set({ scrapPageInfo: info }), // 상태 업데이트 함수
  setIcon: (icon) => set({ icon }), // 상태 업데이트 함수

  saveScrap: async () => {
    const { scrapPageInfo } = useScrapStore.getState();
    saveScrap(
      { ...scrapPageInfo },
      (data) => {
        set({ scrapPageInfo: data.scrap });
      },
      (error) => {
        console.error('Failed to save scrap:', error);
      },
    );
  },

  fetchScrap: async (url, currentPageInfo) => {
    getScrap(
      { url: url },
      (data) => {
        if (data.isScrapped) {
          set({ scrapPageInfo: data.scrap });
        } else {
          set({ scrapPageInfo: { ...currentPageInfo, isRead: false, isNotified: false } });
        }
      },
      (error) => {
        set({ scrapPageInfo: { ...currentPageInfo, isRead: false, isNotified: false } });
        console.error('Failed to fetch scrap status:', error);
      },
    );
  },

  updateRead: async () => {
    const { scrapPageInfo } = useScrapStore.getState();
    updateRead(scrapPageInfo.id, { isRead: true })
      .then(() => {
        set({ scrapPageInfo: { ...scrapPageInfo, isRead: true } });
      })
      .catch((error) => {
        console.error('Failed to update read status:', error);
      });
  },

  updateScrapField: (field, value) =>
    set((state) => ({
      scrapPageInfo: {
        ...state.scrapPageInfo,
        [field]: value, // 특정 필드 업데이트
      },
    })),
}));

export default useScrapStore;
