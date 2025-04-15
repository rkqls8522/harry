import React, { useEffect, useRef } from 'react';
import './components.css';

const One = () => {
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
    <div className="component-container one-container" ref={sectionRef}>
      <div className="content-wrapper">
        <h1 className="main-title">당신의 브라우저를 더 스마트하게,</h1>
        <h2 className="subtitle-line"><span className="highlight">해리</span>와 함께하세요</h2>
      </div>
    </div>
  );
};

export default One;
