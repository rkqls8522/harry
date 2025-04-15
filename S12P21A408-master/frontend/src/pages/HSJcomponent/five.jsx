import React, { useEffect, useRef } from 'react';
import './components.css';

const Five = () => {
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

  const handleDownload = () => {
    // 크롬 익스텐션 다운로드 링크로 이동
    window.open('https://chrome.google.com/webstore/detail/your-extension-id', '_blank');
  };

  return (
    <div className="component-container" ref={sectionRef}>
      <div className="content-wrapper">
        <h2 className="section-title">지금 시작하세요</h2>
        <div className="download-section">
          <div className="download-content">
            <h3>크롬 익스텐션으로 더 스마트한 웹 경험을</h3>
            <p>지금 바로 크롬 익스텐션을 설치하고 모든 기능을 활용해보세요.</p>
            <div className="button-group">
              <button className="primary-button" onClick={handleDownload}>
                크롬 익스텐션 다운로드
              </button>
              <button className="secondary-button">
                자세히 알아보기
              </button>
            </div>
          </div>
          <div className="download-image">
            <div className="image-placeholder">크롬 익스텐션 이미지</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Five;
