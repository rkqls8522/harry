import React, { useEffect, useRef } from 'react';
import './components.css';

const Three = () => {
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
        <h2 className="section-title">페이지 추천</h2>
        <div className="feature-content reverse">
          <div className="feature-text">
            <h3>맞춤형 콘텐츠 추천</h3>
            <p>당신의 관심사와 검색 패턴을 분석하여 최적의 웹페이지를 추천해드립니다. 
               새로운 발견과 학습의 기회를 놓치지 마세요.</p>
            <ul className="feature-list">
              <li>개인화된 추천 알고리즘</li>
              <li>관심사 기반 콘텐츠 매칭</li>
              <li>실시간 추천 업데이트</li>
              <li>다양한 카테고리 지원</li>
            </ul>
          </div>
          <div className="feature-image">
            <div className="image-placeholder">추천 시스템 이미지</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Three;
