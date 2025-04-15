import React, { useEffect, useRef, useState } from 'react';
import useHighlightStore from '../store/highlightStore';

function TagDropdownComponent({ archiveId, onClose }) {
  const ref = useRef();
  const [inputValue, setInputValue] = useState('');

  const { suggestedTags, selectedTags, fetchTagsHistory, addTag, removeTag, fetchTags, isFirstLoad } =
    useHighlightStore();

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !selectedTags.map((tag) => tag.name).includes(trimmed)) {
      addTag(archiveId, trimmed);
    }
    setInputValue('');
  };

  useEffect(() => {
    if (!isFirstLoad) {
      fetchTags(archiveId, fetchTagsHistory); // AI 태그 가져오기
    }

    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose(); // 바깥 클릭 시 닫기
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTags = (suggestedTags || []).filter(
    (tag) =>
      tag.name.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
      !selectedTags.some((t) => t.name.toLowerCase() === tag.name.toLowerCase()),
  );

  return (
    <div
      ref={ref}
      className="absolute z-10 min-w-[370px] max-w-[370px] bg-white border border-gray-200 rounded-xl mt-1 p-3 shadow-lg max-h-64 overflow-y-auto space-y-3"
    >
      {/* 선택된 태그 + 입력창 */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-2">
        {selectedTags &&
          selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="bg-gray-200 text-sm px-3 py-1 rounded-full text-gray-700 flex items-center gap-1"
            >
              {tag.name}
              <button onClick={() => removeTag(tag.id)} className="text-gray-500 hover:text-gray-700 text-xs">
                ✕
              </button>
            </span>
          ))}

        <input
          type="text"
          placeholder="Add a tag"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          className="flex-1 min-w-[100px] pl-2 outline-none bg-transparent text-sm text-gray-600 placeholder-gray-400"
        />
      </div>

      {/* 추천 태그 목록 */}
      <div className="space-y-1">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag, index) => (
            <div
              key={index}
              onClick={() => {
                if (!selectedTags.map((tag) => tag.name).includes(tag.name)) {
                  addTag(archiveId, tag.name);
                }
              }}
              className="flex justify-between items-center px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer rounded"
            >
              <span className="truncate">{tag.name}</span>
              {tag.ai && <span className="text-xs text-gray-400 ml-4">(해리 추천)</span>}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400 px-2 py-1">No tags found</div>
        )}
      </div>
    </div>
  );
}

export default TagDropdownComponent;
