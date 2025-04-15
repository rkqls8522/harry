import { create } from 'zustand';
import { getArchives, searchArchives } from '../services/archiveService';
import { getAllTags, getHierarchicalTags, getTopTags } from '../services/tagService';

const useArchiveStore = create((set, get) => ({
  // -- 아카이브 관련 상태 --
  archives: [],
  pageInfo: {
    size: 0,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  },

  fetchArchives: async (params) => {
    getArchives(
      params,
      (data) => {
        set({
          archives: data.content,
          pageInfo: data.page,
        });
      },
      (error) => {
        console.error('Error fetching archives:', error);
      },
    );
  },

  searchArchives: async (params) => {
    searchArchives(
      params,
      (data) => {
        set({
          archives: data.content,
          pageInfo: data.page,
        });
      },
      (error) => {
        console.error('Error searching archives:', error);
      },
    );
  },

  // -- 태그 관련 상태 --
  allTags: [],

  hierarchicalTags: [],

  topTags: [],

  fetchTargetTags: async (tagNames) => {
    console.log('tagNames', tagNames);

    const { selectedItem } = get();
    const params =
      selectedItem === 'all'
        ? { tagNames: tagNames.map((tag) => tag.name) }
        : { folderName: selectedItem, tagNames: tagNames.map((tag) => tag.name) };

    getArchives(
      params,
      (data) => {
        set({
          archives: data.content,
          pageInfo: data.page,
        });
      },
      (error) => {
        console.error('Error fetching archives:', error);
      },
    );
  },

  fetchAllTags: async () => {
    getAllTags(
      (data) => {
        set({ allTags: data.content });
      },
      (error) => {
        console.error('Error fetching tags:', error);
      },
    );
  },

  fetchHierarchicalTags: async () => {
    getHierarchicalTags(
      (data) => {
        set({ hierarchicalTags: data.content });
      },
      (error) => {
        console.error('Error fetching hierarchical tags:', error);
      },
    );
  },

  fetchTopTags: async (params) => {
    getTopTags(
      params,
      (data) => {
        set({ topTags: data.content.map((tag) => ({ id: tag.archiveTagId, name: tag.name })) });
      },
      (error) => {
        console.error('Error fetching top tags:', error);
      },
    );
  },

  // -- 탭 관련 상태 --
  selectedTab: 'tree',
  selectedItem: 'all',
  isHierarchical: true, // 계층형 여부

  setSelectedTab: (tab) => set({ selectedTab: tab }), // 탭 변경 함수
  setSelectedItem: (item) => set({ selectedItem: item }), // 태그 선택 함수
  setIsHierarchical: (isHierarchical) => set({ isHierarchical }), // 계층형 여부 설정 함수
}));

export default useArchiveStore;
