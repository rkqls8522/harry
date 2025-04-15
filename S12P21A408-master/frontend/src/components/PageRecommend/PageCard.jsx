import React from 'react';
import noImage from '../../assets/harry_noImage.png'; // ← 실제 경로에 맞춰 수정

// 링크 아이콘 컴포넌트
const LinkIcon = ({ color = '#5B7CFD' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

// 단일 카드 컴포넌트
const PageCard = ({ data }) => {
  const { title = '페이지 제목', link = '#', thumbnail = '/api/placeholder/280/160' } = data || {};

  // 도메인 추출 함수
  // const extractDomain = (url) => {
  //   try {
  //     const domain = new URL(url).hostname;
  //     return domain;
  //   } catch (e) {
  //     // URL이 유효하지 않은 경우 원래 링크 반환
  //     console.error('Invalid URL:', url, e);
  //     return url;
  //   }
  // };

  // const domain = extractDomain(link);

  // 썸네일 이미지가 없을 경우 기본 이미지로 대체
  const defaultThumbnail = thumbnail === null ? noImage : thumbnail;
  // 카드 클릭 핸들러 - 링크로 이동
  const handleCardClick = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="simple-card" onClick={handleCardClick}>
      <div className="card-image">
        <img src={defaultThumbnail} alt={title} />
        <div className="shine-effect"></div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-footer">
          {/* <div className="card-source">
            <div className="card-source-icon">
              <LinkIcon />
            </div>
            <span className="card-source-name">{link}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PageCard;
