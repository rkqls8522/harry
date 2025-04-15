// src/store/scheduleStore.js
import { create } from 'zustand';
import api from '../utils/aiApi';
import useAuthStore from './authStore';

const useScheduleStore = create((set, get) => ({
  schedules: [],
  loading: false,
  error: null,

  fetchSchedules: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const scheduleData = await api.get(`/schedules/${user.id}`);
      const fetchedSchedules = Array.isArray(scheduleData) ? scheduleData : [];

      // 날짜 문자열을 Date 객체로 변환
      const formattedSchedules = fetchedSchedules.map((schedule) => ({
        ...schedule,
        expire_time: new Date(schedule.expire_time),
        alarm_time: new Date(schedule.alarm_time),
      }));

      console.log('날짜 문자열 date 객체로 변환', formattedSchedules);

      set({
        schedules: formattedSchedules,
        loading: false,
      });
      return formattedSchedules;
    } catch (error) {
      console.error('일정 조회 오류:', error);
      set({
        error: error.message || '일정을 불러오는 중 오류가 발생했습니다.',
        loading: false,
      });
      return [];
    }
  },

  // 일정 추가
  addSchedule: async (scheduleData) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      console.log('원본 일정 데이터:', scheduleData);

      // Date 객체를 ISO 문자열로 변환
      const formattedData = {
        ...scheduleData,
        member_id: user.id,
        // 날짜 형식이 Date 객체일 경우 ISO 문자열로 변환
        expire_time:
          scheduleData.expire_time instanceof Date ? scheduleData.expire_time.toISOString() : scheduleData.expire_time,
        alarm_time:
          scheduleData.alarm_time instanceof Date ? scheduleData.alarm_time.toISOString() : scheduleData.alarm_time,
      };

      console.log('서버로 보내는 형식화된 데이터:', formattedData);

      const response = await api.post('/schedules/', formattedData);
      console.log('서버 응답:', response);

      const newSchedule = response.data || {
        ...formattedData,
        id: Math.floor(Math.random() * 1000), // 임시 ID (실패 시)
      };

      // 기존 스케줄에 새 일정 추가
      const { schedules } = get();
      set({
        schedules: [...schedules, newSchedule],
      });

      return newSchedule;
    } catch (error) {
      console.error('일정 추가 오류:', error);
      // 요청 데이터 로깅
      console.error('요청 데이터:', scheduleData);

      if (error.response) {
        console.error('오류 응답:', error.response.data);
        console.error('상태 코드:', error.response.status);
      }

      throw error;
    }
  },

  // 일정 수정
  updateSchedule: async (scheduleId, scheduleData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/schedules/${scheduleId}`, scheduleData);

      const updatedSchedule = response.data || response;

      const formattedSchedule = {
        ...updatedSchedule,
        expire_time: updatedSchedule.expire_time ? new Date(updatedSchedule.expire_time) : null,
        alarm_time: updatedSchedule.alarm_time ? new Date(updatedSchedule.alarm_time) : null,
      };

      set((state) => ({
        schedules: state.schedules.map((schedule) => (schedule.id === scheduleId ? formattedSchedule : schedule)),
        loading: false,
      }));

      return formattedSchedule;
    } catch (error) {
      set({
        error: error.message || '일정 수정 중 오류가 발생했습니다.',
        loading: false,
      });
      console.error('일정 수정 오류:', error);
      throw error;
    }
  },

  // 일정 삭제
  deleteSchedule: async (scheduleId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/schedules/${scheduleId}`);

      set((state) => ({
        schedules: state.schedules.filter((schedule) => schedule.id !== scheduleId),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.message || '일정 삭제 중 오류가 발생했습니다.',
        loading: false,
      });
      console.error('일정 삭제 오류:', error);
      throw error;
    }
  },

  // 특정 날짜의 일정 필터링
  getSchedulesForDate: (date) => {
    const schedules = get().schedules;
    return schedules.filter((schedule) => schedule.expire_time.toDateString() === date.toDateString());
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));

export default useScheduleStore;
