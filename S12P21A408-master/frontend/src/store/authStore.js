// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMember } from '../services/member/memberService';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      tokenSentToExtension: false,

      sendTokenToExtension: async () => {
        if (get().tokenSentToExtension) return;

        set({ loading: true });

        getMember(
          async (data) => {
            set({ loading: false, user: data, isAuthenticated: true });

            // 쿠키에서 토큰 추출
            const cookies = document.cookie.split('; ');
            const tokenCookie = cookies.find((row) => row.startsWith('accessToken='));

            if (!tokenCookie) {
              console.error('토큰을 찾을 수 없습니다.');
              return;
            }

            const token = tokenCookie.split('=')[1] || '';
            console.log('토큰:', token);

            try {
              const now = new Date();
              const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
              const kstISOString = kstDate.toISOString().replace('Z', '');

              // 알람 예정 일정 API 호출
              const response = await axios.get('https://j12a408.p.ssafy.io/api/notification-schedules/upcoming', {
                params: {
                  memberId: data.id,
                  loginTime: kstISOString,
                },
                headers: { Authorization: `Bearer ${token}` },
              });

              const upcomingNotifications = response.data;
              console.log('알람 예정 일정:', upcomingNotifications);
              console.log('방문기록 전송 여부(hasVisitRecord)', data.hasVisitRecord);

              // 토큰과 알람 예정 일정 함께 익스텐션으로 전달
              window.postMessage(
                {
                  source: 'HARY',
                  type: 'ACCESS_TOKEN_AND_NOTIFICATIONS',
                  accessToken: token,
                  notifications: upcomingNotifications,
                  hasVisitRecord: data.hasVisitRecord,
                },
                '*',
              );
            } catch (error) {
              console.error('알람 예정 일정 가져오기 오류:', error);

              // 일정 알람 조회 오류가 발생해도 토큰은 전달
              window.postMessage(
                {
                  source: 'HARY',
                  type: 'ACCESS_TOKEN',
                  accessToken: token,
                  hasVisitRecord: data.hasVisitRecord,
                },
                '*',
              );
            }
          },
          (error) => {
            console.error('회원 정보 가져오기 오류:', error);
            set({ user: null, isAuthenticated: false, loading: false });
          },
        );
      },

      fetchMyInfo: async () => {
        // 이미 인증된 상태이고 사용자 정보가 있으면 API 호출 스킵
        if (get().isAuthenticated && get().user) {
          set({ loading: false });
          return;
        }

        // 토큰이 있는지 확인
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find((row) => row.startsWith('accessToken='));

        if (!tokenCookie) {
          // 토큰이 없으면 비인증 상태로 설정하고 종료
          set({ user: null, isAuthenticated: false, loading: false });
          return;
        }

        set({ loading: true });

        getMember(
          (data) => {
            set({ loading: false, user: data, isAuthenticated: true });
          },
          (error) => {
            console.error('회원 정보 가져오기 오류:', error);
            set({ user: null, isAuthenticated: false, loading: false });
          },
        );
      },

      // 로그인 - 현재 사용하고 있지 않음
      login: async () => {
        getMember(
          (data) => {
            set({ user: data, isAuthenticated: true });
          },
          (error) => {
            console.error('로그인 오류:', error);
            set({ user: null, isAuthenticated: false });
          },
        );
      },

      // 로그아웃 함수
      logout: () => {
        // 쿠키에서 토큰 제거 - 필요한 경우 백엔드 로그아웃 API 호출
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        set({ user: null, isAuthenticated: false, tokenSentToExtension: false });
      },
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 키 이름
      getStorage: () => localStorage, // 사용할 스토리지 지정
      partialize: (state) => ({
        // 저장할 상태만 선택
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tokenSentToExtension: state.tokenSentToExtension,
        // loading 상태는 저장하지 않음 (항상 초기값으로 시작)
      }),
    },
  ),
);

export default useAuthStore;
