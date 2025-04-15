import React from 'react';
import { FolderOpen } from 'lucide-react';
import useArchiveStore from '../../store/archiveStore';

function TreeList({ treeMenu, openMenus, selectedItem, setSelectedItem, toggleFolder }) {
  const { fetchArchives, fetchTopTags, setIsHierarchical } = useArchiveStore();

  return (
    <div className="tag-list-grouped space-y-4">
      {/* 👁‍🗨 전체 보기 섹션 */}
      <div>
        <div className="group-label text-xs font-semibold mb-2 tag-group">all</div>
        <ul className="tag-list">
          <li
            key="all"
            onClick={() => {
              setSelectedItem('all');
              setIsHierarchical(true);
              fetchTopTags();
              fetchArchives();
            }}
            className={`tag-item ${selectedItem === 'all' ? 'active' : ''}`}
          >
            <span className="inline-flex items-center gap-2">
              {/* <FolderOpen className="w-4 h-4" /> */}
              모두 보기
            </span>
          </li>
        </ul>
      </div>

      {/* 📂 트리 메뉴 섹션 */}
      {Object.entries(treeMenu).map(([folder, children]) => (
        <div key={folder}>
          {/* 상위 폴더 라벨 */}
          <div
            onClick={() => toggleFolder(folder)}
            className={`group-label text-xs text-gray-400 font-semibold mb-2 tag-group cursor-pointer`}
          >
            {openMenus.includes(folder) ? '▾' : '▸'} {folder}
          </div>

          {/* 자식 항목들 */}
          {openMenus.includes(folder) && (
            <ul className="tag-list">
              {children.map((child) => {
                const fullPath = `${folder}/${child.pathName === '/' ? '' : child.pathName}`;
                return (
                  <li
                    key={fullPath}
                    onClick={() => {
                      setSelectedItem(fullPath);
                      setIsHierarchical(true);
                      fetchArchives({ folderName: fullPath });
                      fetchTopTags({ tagName: fullPath });
                    }}
                    className={`tag-item ${selectedItem === fullPath ? 'active' : ''}`}
                  >
                    {child.pathName}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default TreeList;
