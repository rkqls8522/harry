import React, { useEffect, useState, useRef } from 'react';

// 별도 스타일 컴포넌트를 밖으로 분리 (Fast Refresh 문제 해결)
const TagComponentStyles = () => {
  useEffect(() => {
    const styleId = 'tag-component-styles';

    // 이미 스타일이 존재하는지 확인
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        /* 태그 컴포넌트 전용 스타일 */
        .tag-component-wrapper {
          position: relative;
          width: 100%;
          max-width: 6xl;
          margin: 0 auto;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          z-index: 5;
        }
        
        .tag-component-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .tag-component-fade-left {
          background: linear-gradient(90deg, #f7f9fc 0%, rgba(247, 249, 252, 0) 100%);
        }
        
        .tag-component-fade-right {
          background: linear-gradient(270deg, #f7f9fc 0%, rgba(247, 249, 252, 0) 100%);
        }
        
        @keyframes tag-bounce-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        @keyframes tag-bounce-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
        
        .tag-component-arrow-right {
          animation: tag-bounce-right 1.5s infinite;
        }
        
        .tag-component-arrow-left {
          animation: tag-bounce-left 1.5s infinite;
        }
      `;
      document.head.appendChild(styleElement);
    }

    // 컴포넌트 언마운트 시 스타일 제거하지 않음 (다중 인스턴스 고려)
  }, []);

  return null;
};

// 메인 컴포넌트 함수 선언
const TagComponent = ({
  tags = [],
  setSelected = () => {},
  loading = false,
  minSelectable = 0,
  autoSelectFirst = false,
}) => {
  // 데이터 형식 검증 및 변환 - 핵심 수정 부분
  const normalizedTags = React.useMemo(() => {
    if (!Array.isArray(tags)) {
      console.warn('TagComponent: tags is not an array', tags);
      return [];
    }

    return tags.map((tag) => {
      // 이미 올바른 형식인 경우
      if (tag && typeof tag === 'object' && tag.id && tag.name) {
        return tag;
      }

      // archiveTagId를 id로 변환해야 하는 경우
      if (tag && typeof tag === 'object' && tag.archiveTagId) {
        return {
          id: tag.archiveTagId,
          name: tag.name || '태그 없음',
        };
      }

      // 기타 예외 처리
      return {
        id: typeof tag === 'object' ? tag.id || String(Math.random()) : String(Math.random()),
        name: typeof tag === 'object' ? tag.name || '태그 없음' : String(tag),
      };
    });
  }, [tags]);

  const [selectedTags, setSelectedTags] = useState([]);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect for initial tag selection
  useEffect(() => {
    if (!isInitialized && normalizedTags.length > 0) {
      if (autoSelectFirst && selectedTags.length === 0) {
        setSelectedTags([normalizedTags[0]]);
        setSelected([normalizedTags[0]]);
      } else if (!autoSelectFirst) {
        setSelectedTags([]);
        setSelected([]);
      }
      setIsInitialized(true);
    }
  }, [normalizedTags, autoSelectFirst, isInitialized, selectedTags.length, setSelected]);

  // 스크롤 화살표 표시 여부 체크
  useEffect(() => {
    const checkScrollPosition = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // 스크롤 위치에 따라 화살표 표시 여부 결정
      const isStart = container.scrollLeft <= 20;
      setIsAtStart(isStart);
      setShowLeftArrow(container.scrollLeft > 20);
      setShowRightArrow(
        container.scrollWidth > container.clientWidth &&
          container.scrollLeft < container.scrollWidth - container.clientWidth - 20,
      );
    };

    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      }
    };
  }, [normalizedTags]);

  // 좌우 스크롤 함수
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // 터치 스와이프 기능 처리
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scrollRight();
    }
    if (isRightSwipe) {
      scrollLeft();
    }
  };

  // Tag click handler with modified setSelected invocation - 핵심 수정 부분
  const handleTagClick = (tag) => {
    const isSelected = selectedTags.some((selectedTag) => selectedTag.id === tag.id);

    if (isSelected) {
      if (selectedTags.length <= minSelectable) {
        console.warn(`최소 ${minSelectable}개 이상의 태그를 선택해야 합니다.`);
        return;
      }

      const newSelectedTags = selectedTags.filter((t) => t.id !== tag.id);
      setSelectedTags(newSelectedTags);

      try {
        // setSelected 함수가 태그 객체 배열이나 태그 이름 배열을 모두 처리할 수 있도록 래핑
        setSelected(newSelectedTags);
      } catch (err) {
        console.error('Error in setSelected:', err);
      }
    } else {
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);

      try {
        // setSelected 함수가 태그 객체 배열이나 태그 이름 배열을 모두 처리할 수 있도록 래핑
        setSelected(newSelectedTags);
      } catch (err) {
        console.error('Error in setSelected:', err);
      }
    }
  };

  // 스크롤바 없는 스타일 적용
  const scrollbarStyle = {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '0.75rem',
    padding: '0.25rem 0.25rem 0.5rem 0.25rem',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    position: 'relative',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  };

  return (
    <div className="tag-component-wrapper py-3 w-full max-w-6xl mx-auto relative">
      {/* 스타일 삽입 컴포넌트 */}
      <TagComponentStyles />

      {loading ? (
        // 로딩 상태
        <div className="py-2 flex justify-center items-center">
          <div className="flex items-center space-x-2 text-gray-500">
            <svg
              className="animate-spin h-5 w-5 text-[#007BE5]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="font-medium text-sm">태그를 불러오는 중...</span>
          </div>
        </div>
      ) : normalizedTags.length === 0 ? (
        // 원래 태그 스타일에 맞는 세련된 디자인
        <div className="py-3 flex flex-col items-center justify-center">
          <div className="mb-2 mt-2 flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#007BE5] opacity-50 mr-3"></div>
            <span className="px-5 py-2.5 bg-blue-50 text-[#007BE5] font-semibold text-sm rounded-full border border-blue-200 shadow-sm flex items-center transition-all duration-300 ease-in-out transform hover:scale-105">
              태그를 추가해 보세요
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#007BE5] opacity-50 ml-3"></div>
          </div>
          <p className="text-gray-400 text-xs mt-1">하이라이트된 게시물을 더 쉽게 찾을 수 있어요</p>
        </div>
      ) : (
        // 태그 목록 렌더링
        <>
          {/* 좌측 화살표 */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center"
              aria-label="스크롤 왼쪽으로"
            >
              <div className="absolute inset-0 tag-component-fade-left opacity-50"></div>
              <svg
                className="h-6 w-6 text-[#007BE5] tag-component-arrow-left relative"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* 태그 버튼 목록 */}
          <div
            className={`tag-component-scrollbar ${isAtStart ? 'ml-4 mr-8' : 'mx-8'}`}
            style={scrollbarStyle}
            ref={scrollContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 시작 표시기 */}
            {isAtStart && (
              <div className="flex-shrink-0 self-center py-0.5">
                <div className="w-2 h-2 rounded-full bg-[#007BE5] opacity-50"></div>
              </div>
            )}

            {/* 태그 버튼들 */}
            {normalizedTags.map((tag) => {
              const isSelected = selectedTags.some((selectedTag) => selectedTag.id === tag.id);
              return (
                <div key={tag.id} className="flex-shrink-0 py-0.5">
                  <button
                    onClick={() => handleTagClick(tag)}
                    className={`
                      px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide
                      whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]
                      transition-all duration-300 ease-in-out transform
                      ${isSelected ? 'bg-[#007BE5] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      focus:outline-none focus:ring-2 focus:ring-offset-1
                      ${isSelected ? 'focus:ring-[#3f9aea]' : 'focus:ring-gray-300'}
                      active:scale-95
                    `}
                    title={tag.name}
                  >
                    {tag.name}
                  </button>
                </div>
              );
            })}

            {/* 끝 표시기 */}
            <div className="flex-shrink-0 self-center py-0.5">
              <div className="w-2 h-2 rounded-full bg-[#007BE5] opacity-50"></div>
            </div>
          </div>

          {/* 우측 화살표 */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center"
              aria-label="스크롤 오른쪽으로"
            >
              <div className="absolute inset-0 tag-component-fade-right opacity-50"></div>
              <svg
                className="h-6 w-6 text-[#007BE5] tag-component-arrow-right relative"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* 모바일 안내 */}
          {normalizedTags.length > 5 && (
            <div className="text-xs text-center text-gray-400 mt-1 md:hidden">
              ← 좌우로 스와이프하여 더 많은 태그 보기 →
            </div>
          )}
        </>
      )}
    </div>
  );
};

// 주의: 반드시 이 방식으로 내보내기
export default TagComponent;
