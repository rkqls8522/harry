import React, { useEffect, useRef } from 'react';
import './components.css';

const Four = () => {
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
        <h2 className="section-title">AI 챗봇</h2>
        <div className="feature-content">
          <div className="feature-image">
            <div className="image-placeholder">챗봇 이미지</div>
          </div>
          <div className="feature-text">
            <h3>스마트한 AI 어시스턴트</h3>
            <p>웹 검색과 정보 수집을 도와주는 AI 챗봇과 대화하세요. 
               복잡한 질문에도 정확한 답변을 제공하며, 당신의 웹 경험을 더욱 풍부하게 만들어줍니다.</p>
            <ul className="feature-list">
              <li>자연스러운 대화형 인터페이스</li>
              <li>맞춤형 정보 제공</li>
              <li>사용자 답변에 대한 감정 변화</li>
              <li>일정 저장 및 관리</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Four;
