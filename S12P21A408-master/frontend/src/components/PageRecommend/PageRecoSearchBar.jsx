// // src/components/common/SearchBar.jsx
// import React from 'react';
// import { Search } from 'lucide-react';
// import '../Sidebar/SearchBar.css'; // 또는 기존 Sidebar.css에서 필요한 스타일만 분리

// const PageRecoSearchBar = ({ placeholder = '' }) => {
//   return (
//     <div className="search-bar">
//       <div className="search-input-wrapper">
//         <Search size={16} className="search-icon" />
//         <input type="text" className="search-input" placeholder={placeholder} />
//       </div>
//     </div>
//   );
// };

// export default PageRecoSearchBar;

// src/components/common/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Pin } from 'lucide-react';
import './PageRecoSearchBar.css';
import '../Sidebar/SearchBar.css';
import pageRecoStore from '../../store/pageRecoStore'; // 페이지 추천 스토어에서 가져오기

const PageRecoSearchBar = ({ placeholder = '플랫폼 검색' }) => {
  const { fetchAllPlatforms, fetchInsertPlatform } = pageRecoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allPlatforms, setAllPlatforms] = useState([]);
  const [filteredPlatforms, setFilteredPlatforms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  // 검색어에 따른 플랫폼 필터링
  useEffect(() => {
    if (!allPlatforms.length) return;

    if (searchTerm === '') {
      setFilteredPlatforms(allPlatforms);
    } else {
      const filtered = allPlatforms.filter((platform) =>
        platform.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredPlatforms(filtered);
    }
  }, [searchTerm, allPlatforms]);

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 포커스 시 드롭다운 열기 및 데이터 로드
  const handleFocus = async () => {
    setIsOpen(true);

    if (allPlatforms.length === 0) {
      try {
        setIsLoading(true);
        const fetchedPlatforms = await fetchAllPlatforms();
        setAllPlatforms(fetchedPlatforms);
        setFilteredPlatforms(fetchedPlatforms);
      } catch (error) {
        console.error('플랫폼 로드 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 검색어 입력 처리
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  // 플랫폼 선택 처리
  const handleSelectPlatform = (platform) => {
    console.log('추가된 platform:', platform);
    // 검색창 비우기
    setSearchTerm('');
    fetchInsertPlatform(platform.platformId);
    setAllPlatforms(allPlatforms.filter((p) => p.id !== platform.id)); // allPlatforms에서 제거
    setIsOpen(false);
  };

  return (
    <div className="search-bar" ref={wrapperRef}>
      <div className="search-input-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
      </div>

      {isOpen && (
        <div className="platform-dropdown">
          {isLoading ? (
            <div className="loading-message">불러오는 중...</div>
          ) : filteredPlatforms.length > 0 ? (
            filteredPlatforms.map((platform, index) => (
              <div
                key={platform.id || index}
                className={`platform-item`}
                onClick={() => handleSelectPlatform(platform)}
              >
                <span className="platform-name">{platform.name}</span>
              </div>
            ))
          ) : (
            <div className="no-results">검색 결과가 없습니다</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageRecoSearchBar;
