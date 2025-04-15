import React from 'react';
import ArchiveCardComponent from './ArchiveCardComponent';
import useArchiveStore from '../../store/archiveStore';
import TagComponent from '../common/TagComponent';
import noContentImage from '../../pages/HSJcomponent/HSJasset/no_content.png';

function ArchiveCardListComponent() {
  const { archives, isHierarchical, topTags, fetchTargetTags } = useArchiveStore();

  return (
    <div>
      {isHierarchical && <TagComponent tags={topTags} setSelected={fetchTargetTags} loading={false} />}{' '}
      {/* 계층형 탭인 경우 TOP 태그컴포넌트 추가*/}
      {/* <div className="bg-white flex flex-col">
        {archives.map((item) => (
          <ArchiveCardComponent key={item.archiveId} item={item} />
        ))}
      </div> */}
      <div className="flex flex-col">
        {archives.length === 0 ? (
          <div className="empty-container">
            <div className="empty-content">
              <img src={noContentImage} alt="No content" className="empty-image" />
            </div>
          </div>
        ) : (
          archives.map((item) => <ArchiveCardComponent key={item.archiveId} item={item} />)
        )}
      </div>
    </div>
  );
}

export default ArchiveCardListComponent;
