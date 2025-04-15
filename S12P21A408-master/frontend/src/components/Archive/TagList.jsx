import React from 'react';
import './TagList.css';
import useArchiveStore from '../../store/archiveStore';

function TagList({ allTags, selectedItem, setSelectedItem }) {
  const { fetchArchives, setIsHierarchical } = useArchiveStore();
  const hasAnyTags = allTags.some((group) => group.tags.length > 0);

  if (!hasAnyTags) {
    return <div className="text-center text-gray-500 py-4">첫 태그를 달아보세요!</div>;
  }
  return (
    <div className="tag-list-grouped space-y-4">
      {allTags.map(
        (group) =>
          group.tags.length > 0 && (
            <div key={group.group}>
              <div className="group-label text-xs text-gray-400 font-semibold mb-2 tag-group">{group.group}</div>
              <ul className="tag-list">
                {group.tags.map((tag) => (
                  <li
                    key={tag.archiveTagId}
                    onClick={() => {
                      setSelectedItem(tag.name);
                      setIsHierarchical(false);
                      fetchArchives({ tagNames: [tag.name] });
                    }}
                    className={`tag-item ${selectedItem === tag.name ? 'active' : ''}`}
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            </div>
          ),
      )}
    </div>
  );
}

export default TagList;
