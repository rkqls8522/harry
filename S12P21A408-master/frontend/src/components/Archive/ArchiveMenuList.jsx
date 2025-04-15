import React, { useState, useEffect } from 'react';
import MenuTab from './ArchiveMenuTabs';
import TreeList from './TreeList';
import TagList from './TagList';
import ScrapFilterList from './ScrapFilterList';
import '../PageRecommend/Menu.css';
import useArchiveStore from '../../store/archiveStore';

function ArchiveMenuList() {
  const [openMenus, setOpenMenus] = useState(['all']); // TODO[지윤]: 트리 기본 열림/닫힘 상태관리

  const {
    allTags,
    fetchAllTags,
    hierarchicalTags,
    fetchHierarchicalTags,
    fetchTopTags,
    selectedTab,
    selectedItem,
    setSelectedTab,
    setSelectedItem,
  } = useArchiveStore();

  const processTreeMenu = (flatTags) => {
    const tree = {};

    if (flatTags.length === 0) {
      return tree;
    }

    flatTags.forEach((tag) => {
      const parts = tag.name.split('/');
      const parent = parts[0];
      const child = parts.length === 1 || tag.name.endsWith('/') ? '/' : parts[1];

      if (!tree[parent]) {
        tree[parent] = [];
      }

      const isDuplicate = tree[parent].some((item) => item.pathName === child);
      if (!isDuplicate) {
        tree[parent].push({
          pathName: child,
          archiveId: tag.archiveTagId,
        });
      }
    });

    console.log('Processed tree:', tree);
    return tree;
  };

  useEffect(() => {
    if (selectedTab === 'list') {
      fetchAllTags();
    }
    if (selectedTab === 'tree') {
      fetchHierarchicalTags();
      fetchTopTags();
    }
    if (selectedTab === 'scrap') {
      // TODO[지윤]: 스크랩 탭일 때 처리
    }
  }, [fetchAllTags, fetchHierarchicalTags, fetchTopTags, selectedTab]);

  return (
    <div className="relative">
      <MenuTab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div className="flex-1 mt-2 overflow-y-auto text-sm">
        {selectedTab === 'list' && (
          <TagList allTags={allTags} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        )}
        {selectedTab === 'tree' && (
          <TreeList
            treeMenu={processTreeMenu(hierarchicalTags)}
            openMenus={openMenus}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            toggleFolder={(folder) =>
              setOpenMenus((prev) =>
                prev.includes(folder) ? prev.filter((item) => item !== folder) : [...prev, folder],
              )
            }
          />
        )}
        {selectedTab === 'scrap' && <ScrapFilterList selectedItem={selectedItem} setSelectedItem={setSelectedItem} />}
      </div>
    </div>
  );
}

export default ArchiveMenuList;
