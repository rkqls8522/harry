import React, { useEffect, useRef, useState } from 'react';
import { Trash2, Pencil, Ellipsis } from 'lucide-react';
import { Card, CardContent } from './Card';
import Button from './Button';
import './highlight.css'; // CSS 파일을 import하여 스타일 적용

const HighlightCard = ({
  highlight,
  memoInputs,
  editingHighlightId,
  editingMemoIndex,
  onDeleteHighlight,
  onMemoInputChange,
  onAddMemo,
  onEditMemo,
  onSaveEditedMemo,
  onDeleteMemo,
  onCancelEdit,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddMemoInput, setShowAddMemoInput] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Card>
      <CardContent className="border-b-1 border-gray-300 mb-2">
        <div className="relative flex">
          {/* 색상 막대 - 세로 전체 높이 */}
          <div className="w-2" style={{ backgroundColor: highlight.color }} />

          {/* 내용 영역 */}
          <div className="flex-1 pl-4 relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="absolute top-2 right-2 text-gray-400 hover:text-black z-10"
            >
              <Ellipsis className="w-5 h-5" />
            </button>

            {/* 드롭다운 메뉴 */}
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute top-10 right-4 bg-white border border-gray-200 shadow-lg rounded-md z-20 w-40 text-sm"
              >
                <button
                  onClick={() => {
                    setShowAddMemoInput(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  ✏️ 메모 추가
                </button>
                <button
                  onClick={() => {
                    onDeleteHighlight(highlight.highlightId);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                >
                  🗑️ 하이라이트 삭제
                </button>
              </div>
            )}

            <div className="space-y-3 pr-16">
              <div className="highlight-content" dangerouslySetInnerHTML={{ __html: highlight.rawContent }} />
            </div>
          </div>
        </div>
      </CardContent>

      {/* 메모 컨텐트 */}
      {highlight.memos.map((memo) => (
        <div key={memo.id} className="relative p-3 text-sm text-gray-800">
          {editingHighlightId === highlight.highlightId && editingMemoIndex === memo.id ? (
            <div className="rounded-xl p-2 w-full outline-none ring-1 ring-blue-500 bg-white">
              <textarea
                rows={3}
                value={memoInputs[highlight.highlightId] || ''}
                onChange={(e) => onMemoInputChange(highlight.highlightId, e.target.value)}
                className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none placeholder:text-gray-400"
                placeholder="메모를 입력하세요..."
              />
              <div className="flex justify-end gap-2 mt-1">
                <Button
                  onClick={onCancelEdit}
                  className="px-4 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                >
                  취소
                </Button>
                <Button
                  onClick={onSaveEditedMemo}
                  className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start gap-4">
              <div className="whitespace-pre-wrap flex-1">{memo.content}</div>
              <div className="flex items-center gap-4 mt-1 text-gray-400">
                <button
                  onClick={() => onEditMemo(highlight.highlightId, memo.id)}
                  className="hover:text-blue-600 transition"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteMemo(highlight.highlightId, memo.id)}
                  className="hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {editingHighlightId !== highlight.highlightId && showAddMemoInput && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={memoInputs[highlight.highlightId] || ''}
            onChange={(e) => onMemoInputChange(highlight.highlightId, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddMemo(highlight.highlightId);
                setShowAddMemoInput(false);
              } else if (e.key === 'Escape') {
                setShowAddMemoInput(false);
              }
            }}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="메모를 입력하세요"
          />
        </div>
      )}
    </Card>
  );
};

export default HighlightCard;
