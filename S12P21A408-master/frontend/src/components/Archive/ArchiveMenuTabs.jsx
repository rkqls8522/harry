import React from 'react';
import { FolderTree, Tags, Bookmark } from 'lucide-react';

function ArchiveMenuTabs({ selectedTab, setSelectedTab }) {
  const tabs = [
    { id: 'tree', icon: <FolderTree size={18} /> },
    { id: 'list', icon: <Tags size={18} /> },
    { id: 'scrap', icon: <Bookmark size={18} /> },
  ];

  return (
    <div className="flex items-center justify-between gap-3 px-2 py-2 mb-5">
      {tabs.map((tab) => {
        const isActive = selectedTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`
              w-18 h-9 flex items-center justify-center rounded-md transition-all
              ${isActive ? 'bg-[#e6f0ff] text-[#007be5]' : 'text-gray-500 hover:bg-gray-100'}
            `}
          >
            {tab.icon}
          </button>
        );
      })}
    </div>
  );
}

export default ArchiveMenuTabs;
