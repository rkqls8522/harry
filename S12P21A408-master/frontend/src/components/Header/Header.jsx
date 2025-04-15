// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import catLogo from '../../assets/cat.png';
import './Header.css';
import useAuthStore from '../../store/authStore';
// 실제 아이콘 import
import { FiArchive, FiStar, FiCalendar, FiChevronDown } from 'react-icons/fi';

const Header = () => {
  const { user, isAuthenticated, loading, logout } = useAuthStore();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 현재 경로에 따라 active 클래스 추가
  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'nav-link active' : 'nav-link';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // useEffect를 사용해서 외부 클릭 감지
  React.useEffect(() => {
    // 드롭다운이 열려있을 때만 이벤트 리스너 추가
    if (dropdownOpen) {
      const handleClickOutside = (event) => {
        const dropdownContainer = document.querySelector('.user-dropdown-container');
        if (dropdownContainer && !dropdownContainer.contains(event.target)) {
          setDropdownOpen(false);
        }
      };

      // 문서 전체에 클릭 이벤트 리스너 추가
      document.addEventListener('mousedown', handleClickOutside);

      // 컴포넌트 언마운트 또는 드롭다운 상태 변경 시 이벤트 리스너 제거
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className={`header ${isHomePage ? 'homepage-header' : ''}`}>
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src={catLogo} alt="cat logo" className="logo-image" />
            <span className="logo-text">해리</span>
          </Link>
        </div>

        <nav className="navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/archive" className={isActive('/archive')}>
                <FiArchive className="nav-icon" />
                <span className="nav-text">아카이브</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/recommendations" className={isActive('/recommendations')}>
                <FiStar className="nav-icon" />
                <span className="nav-text">페이지 추천</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/calendar" className={isActive('/calendar')}>
                <FiCalendar className="nav-icon" />
                <span className="nav-text">캘린더</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="user-menu">
          {loading ? (
            <div className="loading">로딩 중...</div>
          ) : isAuthenticated && user ? (
            <div className="user-dropdown-container">
              <div className="user-dropdown-trigger" onClick={toggleDropdown}>
                <span className="username">{user.name} 님</span>
                <FiChevronDown className={`dropdown-icon ${dropdownOpen ? 'rotate' : ''}`} />
              </div>
              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <button className="logout-button" onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-link">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
