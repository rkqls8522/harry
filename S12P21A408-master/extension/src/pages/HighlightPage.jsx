import React, { useState } from 'react';
import HighlightListComponent from '../components/HighlightListComponent';
import TagDropdownComponent from '../components/TagDropdownComponent';
import useHighlightStore from '../store/highlightStore';

function HighlightPage() {
  const { isHighlighted, archive, selectedTags } = useHighlightStore();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  if (!isHighlighted) {
    return (
      <div className="page-wrapper flex flex-col items-center justify-center text-gray-500 space-y-4">
        <img src="/icons/surprise.png" alt="harry" className="w-24 h-24 mb-4" />
        <p className="text-lg font-medium">여긴 아직 비어있네요.</p>
        <p className="text-sm text-gray-400">중요한 내용을 하이라이트해서</p>
        <p className="text-sm text-gray-400">해리의 도서관에 담아보세요!</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper space-y-3 scrollbar-hide">
      {/* 공개 상태 + 제목 */}
      <h3 className="text-2xl font-bold text-black leading-snug">{archive.title}</h3>

      {/* Tag */}
      <div className="space-y-2">
        <div
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 py-2 px-1 hover:rounded-lg hover:shadow-md hover:bg-gray-50 cursor-pointer transition"
        >
          {/* 아이콘 + 라벨 */}
          <span className="text-gray-700 font-medium text-sm">🏷️Tag</span>

          {/* 태그들 */}
          {selectedTags.length > 0 ? (
            <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <div className="inline-flex gap-2 ml-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 text-sm rounded-full text-gray-700 transition"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-gray-400 text-sm ml-2">Empty</span>
          )}
        </div>

        {/* 드롭다운 */}
        {isDropdownOpen && (
          <div className="mt-2">
            <TagDropdownComponent archiveId={archive.archiveId} onClose={() => setDropdownOpen(false)} />
          </div>
        )}
      </div>

      <hr className="border-t border-gray-200" />

      {/* Highlight List */}
      <HighlightListComponent />
    </div>
  );
}

export default HighlightPage;
