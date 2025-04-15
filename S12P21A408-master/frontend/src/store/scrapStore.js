import { create } from 'zustand';
import { getScraps, updateScrapIsRead } from '../services/scrapService';

const useScrapStore = create((set) => ({
  scraps: [],
  pageInfo: {
    size: 0,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  },

  fetchScraps: async (params) => {
    getScraps(
      params,
      (data) => {
        set({
          scraps: data.content,
          pageInfo: data.page,
        });
      },
      (error) => {
        console.error('Error fetching scraps:', error);
      },
    );
  },

  setScraps: (scraps) => {
    set(() => ({ scraps }));
  },

  updateScrapIsRead: async (id, value) => {
    updateScrapIsRead(
      id,
      value,
      () => {
        set((state) => ({
          scraps: state.scraps.map((scrap) => (scrap.id === id ? { ...scrap, isRead: value } : scrap)),
        }));
      },
      (error) => {
        console.error('Error updating scrap isRead:', error);
      },
    );
  },

  selectedScrapFilter: 'unread',
  setSelectedScrapFilter: (filter) => set(() => ({ selectedScrapFilter: filter })),
}));

export default useScrapStore;
