import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import useArchiveStore from '../../store/archiveStore';
import './SidebarComponent.css'; // 애니메이션 스타일 정의
import PageRecoSearchBar from '../PageRecommend/PageRecoSearchBar';

function SidebarComponent({ children, from }) {
  const { selectedTab } = useArchiveStore();
  const location = useLocation();

  const searchDisabled = location.pathname.includes('archive') && selectedTab === 'scrap';
  return (
    <aside
      className="
        w-64
        bg-white shadow-md 
        rounded-xl pr-2 pl-2 pt-4 pb-4 
        flex flex-col gap-6
      "
    >
      {/* 검색창 */}
      <div>
        {from === 'recommendations' ? <PageRecoSearchBar /> : null}
        {from === 'archive' ? <SearchBar placeholder="Search" disabled={searchDisabled} /> : null}
      </div>

      {/* children: 메뉴 구조 등 유연 삽입 */}
      <div className="flex flex-col gap-2">{children}</div>
    </aside>
  );
}

export default SidebarComponent;
