import React, { useEffect, useRef } from 'react';
import './components.css';

const Two = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelector('.content-wrapper').classList.add('visible');
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="component-container" ref={sectionRef}>
      <div className="content-wrapper">
        <h2 className="section-title">아카이브</h2>
        <div className="feature-content">
          <div className="feature-image">
            <div className="image-placeholder">아카이브 이미지</div>
          </div>
          <div className="feature-text">
            <h3>모든 웹 콘텐츠를 한 곳에 저장하세요</h3>
            <p>관심 있는 웹페이지, 기사, 블로그 포스트를 쉽게 저장하고 관리하세요. 
               태그와 카테고리를 통해 체계적으로 정리하고 언제든지 빠르게 찾아보세요.</p>
            <ul className="feature-list">
              <li>원클릭 저장 기능</li>
              <li>태그 및 카테고리 관리</li>
              <li>스크랩 기능</li>
              <li>하이라이트를 통한 핵심 정보 저장</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Two;
