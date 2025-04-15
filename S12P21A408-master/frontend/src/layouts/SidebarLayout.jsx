import React from 'react';
import SidebarComponent from '../components/Sidebar/SidebarComponent';
import MenuList from '../components/PageRecommend/MenuList';
import ArchiveMemuList from '../components/Archive/ArchiveMenuList';
import pageRecommendStore from '../store/pageRecommendStore';

const SidebarLayout = ({ children, from }) => {
  const { setSelectedPlatform } = pageRecommendStore();

  return (
    <div className="bg-gray-50 min-h-screen w-full py-6 px-4">
      <div className="max-w-6xl mx-auto flex gap-9 w-full">
        <div className="w-[240px] flex-shrink-0">
          <SidebarComponent from={from}>
            {from === 'recommendations' ? <MenuList setSelected={setSelectedPlatform} /> : null}
            {from === 'archive' ? <ArchiveMemuList /> : null}
          </SidebarComponent>
        </div>
        <main className="flex-1 space-y-6 w-full overflow-hidden">
          {/* 내용이 삐져나오지 않도록 overflow-hidden 추가 */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
