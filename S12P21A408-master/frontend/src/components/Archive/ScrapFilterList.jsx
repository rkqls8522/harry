import React from 'react';
import './TagList.css';
import useScrapStore from '../../store/scrapStore';

function ScrapFilterList() {
  const { selectedScrapFilter, setSelectedScrapFilter, fetchScraps } = useScrapStore();

  // 선택된 스크랩 필터 상태
  // const [selectedScrapFilter, setSelectedScrapFilter] = useState('unread');

  const scrapFilters = [
    { name: '읽지 않은 글', value: 'unread' },
    { name: '읽은 글', value: 'read' },
    { name: '모든 글', value: 'all' },
  ];

  const handleFilterClick = (filterValue) => {
    setSelectedScrapFilter(filterValue);
    fetchScraps({ type: filterValue });
  };

  return (
    <div className="tag-list-grouped space-y-4">
      <div>
        <div className="group-label text-xs text-gray-400 font-semibold mb-2 tag-group">🗂️ 나중에 읽을 페이지</div>
        <ul className="tag-list grid grid-cols-2 gap-2">
          {scrapFilters.map((filter) => (
            <li
              key={filter.value}
              onClick={() => {
                handleFilterClick(filter.value);
              }}
              className={`tag-item ${selectedScrapFilter === filter.value ? 'active' : ''}`}
            >
              {filter.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ScrapFilterList;
