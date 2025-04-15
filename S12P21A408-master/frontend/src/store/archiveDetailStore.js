import { create } from 'zustand';
import {
  deleteHighlight,
  deleteMemo,
  deleteNote,
  deleteTag,
  getArchiveDetail,
  getTagsHistory,
  saveMemo,
  saveNote,
  saveTag,
  updateMemo,
  updateNote,
} from '../services/archiveDetailService';

const useArchiveDetailStore = create((set) => ({
  archive: {
    archiveId: 1,
    title: '',
    url: '',
    isPublic: false,
  },

  selectedTags: [
    { id: 1, name: 'AI' },
    { id: 2, name: 'NLP' },
    { id: 3, name: '키워드' },
  ],

  suggestedTags: [],

  highlights: [
    {
      highlightId: 1,
      rawContent: '흰 화면과 함께 다음',
      color: 'bg-yellow-200',
      memos: [],
    },
    {
      highlightId: 2,
      rawContent: '흰 화면과 함께 다음',
      color: 'bg-yellow-200',
      memos: [],
    },
  ],

  note: '이 페이지는 TextRank에 대해 잘 정리되어 있다.',

  setIsPublic: (value) => set((state) => ({ archive: { ...state.archive, isPublic: value } })),

  fetchArchiveDetail: async (archiveId) => {
    getArchiveDetail(
      archiveId,
      (data) => {
        set({
          archive: { archiveId: data.archiveId, title: data.title, url: data.url, isPublic: data.isPublic },
          highlights: data.highlights,
          note: data.note,
          selectedTags: data.tags,
        });
      },
      (error) => {
        console.error('Error fetching archive detail:', error);
      },
    );
  },

  removeHighlight: async (id) =>
    deleteHighlight(
      id,
      () => {
        set((state) => ({
          highlights: state.highlights.filter((h) => h.highlightId !== id),
        }));
      },
      (error) => {
        console.error('Error deleting highlight:', error);
      },
    ),

  updateMemo: async (id, memoId, value) =>
    updateMemo(
      id,
      memoId,
      value,
      () => {
        set((state) => ({
          highlights: state.highlights.map((h) => {
            if (h.highlightId === id) {
              const updatedMemos = [...h.memos];
              updatedMemos.find((memo) => memo.id === memoId).content = value;
              return { ...h, memos: updatedMemos };
            }
            return h;
          }),
        }));
      },
      (error) => {
        console.error('Error updating memo:', error);
      },
    ),

  addMemo: async (id, value) =>
    saveMemo(
      id,
      value,
      () => {
        set((state) => ({
          highlights: state.highlights.map((h) =>
            h.highlightId === id ? { ...h, memos: [...h.memos, { id: Date.now(), content: value }] } : h,
          ),
        }));
      },
      (error) => {
        console.error('Error adding memo:', error);
      },
    ),

  removeMemo: async (id, memoId) =>
    deleteMemo(
      id,
      memoId,
      () => {
        set((state) => ({
          highlights: state.highlights.map((h) => {
            if (h.highlightId === id) {
              const updatedMemos = h.memos.filter((memo) => memo.id !== memoId);
              return { ...h, memos: updatedMemos };
            }
            return h;
          }),
        }));
      },
      (error) => {
        console.error('Error deleting memo:', error);
      },
    ),

  addNote: async (id, value) =>
    saveNote(
      id,
      value,
      () => {
        set(() => ({
          note: value,
        }));
      },
      (error) => {
        console.error('Error saving note:', error);
      },
    ),

  removeNote: async (id) =>
    deleteNote(
      id,
      () => {
        set(() => ({
          note: null,
        }));
      },
      (error) => {
        console.error('Error deleting note:', error);
      },
    ),

  updateNote: async (id, value) =>
    updateNote(
      id,
      value,
      () => {
        set(() => ({
          note: value,
        }));
      },
      (error) => {
        console.error('Error updating note:', error);
      },
    ),

  fetchTagsHistory: async () =>
    getTagsHistory(
      (data) => {
        console.log('Fetched tags history:', data);
        set({ suggestedTags: data.map((tag) => ({ name: tag.name, ai: false })) });
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

export default useArchiveDetailStore;
