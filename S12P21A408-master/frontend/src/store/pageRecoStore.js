// src/store/keywordStore.ts
import { create } from 'zustand';
import {
  getKeywords,
  getPlatforms,
  deletePlatform,
  getAllPlatforms,
  insertPlatform,
  getAllKeywords,
} from '../services/pageRecoservice';

const pageRecoStore = create((set, get) => ({
  keywords: [],
  platforms: [],
  allPlatforms: [],
  isLoadingKeywords: false,
  isLoadingPlatforms: true,
  allKeywords: [],
  isLoadingAllKeywords: false,

  // TODO: 선택된 키워드로 백엔드 API 연동
  // setSeletectedKeywords: (selectedKeywords) => {
  //   console.log('setSeletectedKeywords', selectedKeywords);
  // },

  setAllPlatforms: (allPlatforms) => {
    set({ allPlatforms }); // 전체 플랫폼 설정
  },

  fetchKeywords: async () => {
    set({ isLoadingKeywords: true }); // 키워드 로딩 시

    return new Promise((resolve, reject) => {
      getKeywords(
        (data) => {
          set({
            keywords: data.keywords,
            isLoadingKeywords: false,
          });
          resolve(data.keywords); // 키워드 데이터를 반환
        },
        (error) => {
          console.error('Error fetching keywords:', error);
          set({ isLoadingKeywords: false });
          reject(error); // 에러 발생 시 reject 호출
        },
      );
    });
  },

  fetchPlatforms: async () => {
    set({ isLoadingPlatforms: true }); // 플랫폼 로딩 시

    return new Promise((resolve, reject) => {
      getPlatforms(
        (data) => {
          set({
            platforms: data.platforms,
            isLoadingPlatforms: false,
          });
          resolve(data.platforms); // 플랫폼 데이터를 반환
        },
        (error) => {
          console.error('Error fetching platforms:', error);
          set({ isLoadingPlatforms: false });
          reject(error); // 에러 발생 시 reject 호출
        },
      );
    });
  },

  fetchAllPlatforms: async () => {
    set({ isLoadingPlatforms: true }); // 플랫폼 로딩 시

    return new Promise((resolve, reject) => {
      getAllPlatforms(
        (data) => {
          const { platforms: allPlatforms } = data;
          const { platforms: selectedPlatforms } = get();
          console.log('delete 이후 선택된 platforms:', selectedPlatforms);
          const filteredPlatforms = allPlatforms.filter(
            (platform) => !selectedPlatforms.some((selectedPlatform) => selectedPlatform.name === platform.name),
          );
          set({
            allPlatforms: filteredPlatforms,
            isLoadingPlatforms: false,
          });
          console.log('Filtered platforms:', filteredPlatforms);
          resolve(filteredPlatforms); // 플랫폼 데이터를 반환
        },
        (error) => {
          console.error('Error fetching all platforms:', error);
          set({ isLoadingPlatforms: false });
          reject(error); // 에러 발생 시 reject 호출
        },
      );
    });
  },

  fetchInsertPlatform: async (platformId) => {
    return new Promise((resolve, reject) => {
      insertPlatform(
        platformId,
        (data) => {
          set({
            platforms: data.platforms,
          });
          console.log('Inserted platform:', data.platforms);
          resolve(data);
        },
        (error) => {
          console.error('Error inserting platform:', error);
          reject(error);
        },
      );
    });
  },

  removePlatform: async (platformId) => {
    return new Promise((resolve, reject) => {
      deletePlatform(
        platformId,
        () => {
          set((state) => ({
            platforms: state.platforms.filter((platform) => platform.platformId !== platformId),
          }));

          resolve();
        },
        (error) => {
          console.error('Error deleting platform:', error);
          reject(error);
        },
      );
    });
  },

  fetchAllKeywords: async () => {
    set({ isLoadingAllKeywords: true });

    return new Promise((resolve, reject) => {
      getAllKeywords(
        (data) => {
          if (data && data.content && data.content.keywords) {
            set({
              allKeywords: data.content.keywords,
              isLoadingAllKeywords: false,
            });
            resolve(data.content.keywords);
          } else {
            console.error('Invalid data structure:', data);
            set({ isLoadingAllKeywords: false });
            reject(new Error('Invalid data structure'));
          }
        },
        (error) => {
          console.error('Error fetching all keywords:', error);
          set({ isLoadingAllKeywords: false });
          reject(error);
        },
      );
    });
  },
}));

export default pageRecoStore;
