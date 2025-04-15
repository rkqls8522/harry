import { create } from 'zustand';
import { deleteHighlight, getHighlights, saveMemo, deleteMemo, updateMemo } from '../services/highlightService';
import { deleteTag, getAITags, getTagsHistory, saveTag } from '../services/highlightTagService';

const useHighlightStore = create((set) => ({
  isHighlighted: false,

  // 아카이브 정보
  archive: {
    archiveId: null,
    title: '',
    url: '',
    note: '',
  },

  // 아카이브의 태그 정보
  isFirstLoad: false,
  historyTags: [],
  selectedTags: [],
  suggestedTags: [],

  // 하이라이트 정보
  highlights: [
    {
      highlightId: '',
      rawContent: '',
      content: '',
      color: '',
      type: '',
      startXpath: '',
      endXpath: '',
      startOffset: 0,
      endOffset: 0,
      createdAt: '',
      updatedAt: '',
    },
  ],

  // 각 하이라이트에 대한 메모 정보
  memos: {},

  fetchHighlights: async (url) => {
    // Fetch highlights from the server
    getHighlights(
      url,
      (data) => {
        console.log('Fetched highlights:', data);
        if (data.isHighlighted) {
          set({ isHighlighted: true });
          set({ archive: { archiveId: data.archive.archiveId, title: data.archive.title, url: data.archive.url } });
          set({ selectedTags: data.archive.tags });
          set({ highlights: data.archive.highlights });
          set({
            // TODO: 순서가 안맞음
            memos: data.archive.highlights.reduce((acc, highlight) => {
              return { ...acc, [highlight.highlightId]: highlight.memos };
            }, {}),
          });
        } else {
          set({ isHighlighted: false });
        }
      },
      (error) => {
        console.error('Failed to fetch highlights:', error);
      },
    );
  },

  deleteHighlight: async (highlightId) =>
    deleteHighlight(
      highlightId,
      () => {
        set((state) => {
          const updated = state.highlights.filter((highlight) => highlight.highlightId !== highlightId);
          return { highlights: updated };
        });
      },
      (error) => {
        console.error('Failed to delete highlight:', error);
      },
    ),

  // Add a memo to a specific highlight
  addMemo: async (highlightId, memo) => {
    saveMemo(
      highlightId,
      memo,
      (data) => {
        set((state) => {
          const existingMemos = state.memos[highlightId] || [];
          return {
            memos: {
              ...state.memos,
              [highlightId]: [...existingMemos, data],
            },
          };
        });
      },
      (error) => {
        console.error('Failed to delete highlight:', error);
      },
    );
  },

  updateMemo: (highlightId, memoId, updatedMemo) =>
    updateMemo(
      highlightId,
      memoId,
      updatedMemo,
      () => {
        set((state) => {
          const existingMemos = state.memos[highlightId] || [];
          const updatedMemos = existingMemos.map((memo) =>
            memo.id === memoId ? { id: memo.id, content: updatedMemo } : memo,
          );
          return {
            memos: {
              ...state.memos,
              [highlightId]: updatedMemos,
            },
          };
        });
      },
      (error) => {
        console.error('Failed to update memo:', error);
      },
    ),

  deleteMemo: (highlightId, memoId) =>
    deleteMemo(
      highlightId,
      memoId,
      () => {
        set((state) => {
          const existingMemos = state.memos[highlightId] || [];
          const updatedMemos = existingMemos.filter((memo) => memo.id !== memoId);
          return {
            memos: {
              ...state.memos,
              [highlightId]: updatedMemos,
            },
          };
        });
      },
      (error) => {
        console.error('Failed to delete memo:', error);
      },
    ),

  fetchTagsHistory: async () =>
    getTagsHistory(
      (data) => {
        console.log('Fetched tags history:', data);
        set((state) => ({
          suggestedTags: [
            ...state.suggestedTags.filter((tag) => tag.ai), // ai가 true인 태그 유지
            ...data.map((tag) => ({ name: tag.name, ai: false })), // 새로운 태그 추가
          ],
        }));
      },
      (error) => {
        console.error('Failed to fetch suggested tags:', error);
      },
    ),

  fetchTags: async (archiveId, onSuccess) =>
    getAITags(
      archiveId,
      (data) => {
        console.log('Fetched AI tags:', data);
        set((state) => ({
          suggestedTags: [
            ...state.suggestedTags, // 기존 태그 유지
            ...data.map((name) => ({ name, ai: true })), // 새로운 태그 추가
          ],
        }));
        set({ isFirstLoad: true });
        onSuccess();
      },
      (error) => {
        console.error('Failed to fetch suggested tags:', error);
      },
    ),

  addTag: async (archiveId, tagName) =>
    saveTag(
      archiveId,
      tagName,
      (data) => {
        set({
          selectedTags: data.map((tag) => ({
            id: tag.archiveTagId,
            name: tag.name,
            isHierarchical: tag.isHierarchical,
          })),
        });
      },
      (error) => {
        console.error('Failed to save tag:', error);
      },
    ),

  removeTag: (tagId) =>
    deleteTag(
      tagId,
      () => {
        set((state) => {
          const updatedTags = state.selectedTags.filter((tag) => tag.id !== tagId);
          return { selectedTags: updatedTags };
        });
      },
      (error) => {
        console.error('Failed to delete tag:', error);
      },
    ),
}));

export default useHighlightStore;
