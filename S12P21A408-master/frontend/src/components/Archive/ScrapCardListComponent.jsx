import React, { useEffect } from 'react';
import ScrapCardComponent from './ScrapCardComponent';
import useScrapStore from '../../store/scrapStore';
import noContentImage from '../../pages/HSJcomponent/HSJasset/no_content.png';

function ScrapCardListComponent() {
  const { scraps, fetchScraps, selectedScrapFilter } = useScrapStore();

  useEffect(() => {
    // 스크랩 데이터를 가져오는 함수 호출
    fetchScraps({ type: selectedScrapFilter });
  }, [fetchScraps, selectedScrapFilter]);

  return (
    <div>
      {scraps.length === 0 ? ( // scraps가 비어 있을 때 처리
        <div className="empty-container">
          <div className="empty-content">
            <img src={noContentImage} alt="No content" className="empty-image" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {scraps.map((item) => (
            <div key={item.id}>
              <ScrapCardComponent item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScrapCardListComponent;
