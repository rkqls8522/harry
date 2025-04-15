// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import ArchiveListPage from './pages/ArchiveListPage';
import './App.css';
import SidebarLayout from './layouts/SidebarLayout';
import PageRecoListPage from './pages/PageRecoListPage';
import ArchiveDetailPage from './pages/ArchiveDetailPage';
import useAuthStore from './store/authStore';

function AppRoutes() {
  const location = useLocation();
  const showHeader = !location.pathname.includes('/login');
  const { sendTokenToExtension, fetchMyInfo } = useAuthStore();

  // 경로가 변경될 때마다 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 로그인 후 extension에 토큰, 알람 일정 반환
  useEffect(() => {
    // URL에서 로그인 성공 파라미터 확인
    const queryParams = new URLSearchParams(location.search);
    const isLoginSuccess = queryParams.get('login') === 'success';

    if (isLoginSuccess) {
      console.log('로그인 성공 감지: 토큰 전송 시작');
      // 로그인 성공 시 토큰 전송 함수 호출
      sendTokenToExtension();

      // URL에서 쿼리 파라미터 제거
      window.history.replaceState({}, document.title, location.pathname);
    } else {
      // 일반적인 페이지 접근 시에는 기본 fetchMyInfo만 호출
      fetchMyInfo();
    }
  }, [location.search, location.pathname, sendTokenToExtension, fetchMyInfo]);

  return (
    <div className="app">
      {showHeader && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/archive"
            element={
              <SidebarLayout from="archive">
                <ArchiveListPage />
              </SidebarLayout>
            }
          />
          <Route
            path="/recommendations"
            element={
              <SidebarLayout from="recommendations">
                <PageRecoListPage />
              </SidebarLayout>
            }
          />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/archives/:archiveId" element={<ArchiveDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
