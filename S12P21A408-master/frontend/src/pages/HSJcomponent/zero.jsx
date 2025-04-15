import React, { useEffect, useRef, useState } from 'react';
import './zero.css';
import { getAllKeywords } from '../../services/pageRecoservice';
import Five from './five';

const CATEGORIES = {
  DEVELOPMENT: ['개발', '프로그래밍', '코딩', '웹', '기술', '프론트엔드', '백엔드'],
  AI: ['AI', '인공지능', '머신러닝', '딥러닝', '데이터'],
  PRODUCTIVITY: ['생산성', '효율', '자동화', '최적화', '관리'],
  UX: ['사용성', '디자인', '인터페이스', '경험', '편리'],
};

const Zero = () => {
  const [keywords, setKeywords] = useState([]);
  const [topKeyword, setTopKeyword] = useState('');
  const cloudRef = useRef(null);
  const [hasKeywords, setHasKeywords] = useState(true);

  useEffect(() => {
    getAllKeywords(
      (response) => {
        console.log('API 응답:', response);
      },
      (error) => {
        console.error('API 에러:', error);
      }
    );
  }, []);

  // 더미 데이터 생성
  const generateDummyData = () => {
    getAllKeywords(
      (response) => {
        if (!response || !Array.isArray(response) || response.length === 0) {
          setHasKeywords(false);
          return;
        }

        // 첫 번째 키워드의 cnt에 1을 더함
        if (response.length > 0) {
          response[0].cnt += 1;
        }

        const maxCnt = Math.max(...response.map(item => item.cnt));
        const minCnt = Math.min(...response.map(item => item.cnt));
        
        const processedData = response.map(item => ({
          word: item.keyword,
          score: 0.5 + ((item.cnt - minCnt) / (maxCnt - minCnt)) * 0.5
        }));

        console.log('변환된 키워드 데이터:', processedData);
        const processedKeywords = displayKeywords(processedData);
        setKeywords(processedKeywords);
        setHasKeywords(true);
      },
      (error) => {
        console.error('API 에러:', error);
        setHasKeywords(false);
      }
    );
  };

  const displayKeywords = (words) => {
    if (!cloudRef.current) return;

    const sortedWords = [...words].sort((a, b) => b.score - a.score);
    setTopKeyword(sortedWords[0].word);

    const container = cloudRef.current;
    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;
    const maxScore = Math.max(...words.map(k => k.score));
    let placedAreas = [];

    const processedWords = words
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
      .map((item, index) => {
        // 키워드 크기 범위를 12px ~ 36px로 조정
        const fontSize = -10 + (50 * (item.score / maxScore));
        const width = fontSize * item.word.length;
        const height = fontSize * 1.5;

        let radius = 0;
        let angle = Math.random() * 2 * Math.PI;
        let spiralGrowth = 8;
        let x = centerX;
        let y = centerY;
        let placed = false;
        
        while (!placed && radius < Math.max(container.clientWidth, container.clientHeight)) {
          x = centerX + radius * Math.cos(angle);
          y = centerY + radius * Math.sin(angle);
          
          const currentArea = {
            left: x - width/1.6,
            right: x + width/1.6,
            top: y - height/1.6,
            bottom: y + height/1.6
          };
          
          if (!placedAreas.some(area => intersects(currentArea, area)) &&
              isWithinContainer(currentArea, container)) {
            placedAreas.push(currentArea);
            placed = true;
            break;
          }
          
          radius += spiralGrowth;
          angle += 0.5;
        }

        return {
          ...item,
          x,
          y,
          fontSize,
          delay: index * 0.1
        };
      });

    return processedWords;
  };

  const isWithinContainer = (area, container) => {
    return area.left >= 0 && 
           area.right <= container.clientWidth && 
           area.top >= 0 && 
           area.bottom <= container.clientHeight;
  };

  useEffect(() => {
    generateDummyData();
  }, []);

  const intersects = (area1, area2) => {
    return !(area1.right < area2.left || 
             area1.left > area2.right || 
             area1.bottom < area2.top || 
             area1.top > area2.bottom);
  };

  return hasKeywords ? (
    <div className="zero-container">
      <p className="issue-text">
        당신의 요즘 이슈는 "<span className="highlight-keyword">{topKeyword}</span>" 입니다
      </p>
      <div className="cloud-container" ref={cloudRef}>
        <div className="cloud-inner">
          {keywords.map((item, index) => (
            <span
              key={index}
              className={`keyword ${index === 0 ? 'top-one' : index < 5 ? 'top-two' : ''}`}
              style={{
                fontSize: `${item.fontSize}px`,
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: 'translate(-50%, -50%)',
                opacity: item.score,
                '--delay': item.delay
              }}
              title={`중요도: ${item.score.toFixed(2)}`}
            >
              {item.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Five />
  );
};

export default Zero;
