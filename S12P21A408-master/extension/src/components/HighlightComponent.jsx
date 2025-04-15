import React, { useState } from 'react';
import { Ellipsis } from 'lucide-react';
import MemoInputComponent from '../components/MemoInputComponent';
import MemoListComponent from '../components/MemoListComponent';
import useHighlightStore from '../store/highlightStore';
import '../assets/css/HighlightComponent.css';

function HighlightComponent({ highlightId, content, color, onDelete }) {
  const { addMemo, memos } = useHighlightStore();
  const [newMemo, setNewMemo] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleAddMemo = () => {
    const trimmed = newMemo.trim();
    if (!trimmed) return;

    addMemo(highlightId, trimmed);
    setNewMemo('');
    setShowInput(false);
  };

  return (
    <div className="highlight-component">
      <div className="highlight-box">
        <div className="highlight-bar" style={{ backgroundColor: color }} />

        <div className="highlight-content-wrapper">
          <button className="ellipsis-button" title="메뉴" onClick={toggleMenu}>
            <Ellipsis size={16} />
          </button>

          {/* 메뉴 팝업 */}
          {menuOpen && (
            <div className="context-menu">
              <button onClick={onDelete} className="context-menu-item">
                하이라이트 삭제
              </button>
              <button
                onClick={() => {
                  setShowInput(true);
                  setMenuOpen(false);
                }}
                className="context-menu-item"
              >
                메모 추가
              </button>
            </div>
          )}

          <div className="highlight-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>

      {/* 메모 카드 */}
      {(memos[highlightId].length > 0 || showInput) && (
        <div className="memo-card">
          <MemoListComponent highlightId={highlightId} />

          {showInput && (
            <MemoInputComponent
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
              onCancel={() => {
                setNewMemo('');
                setShowInput(false);
              }}
              onSave={handleAddMemo}
              isNew={true}
              isFirst={memos[highlightId].length === 0}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default HighlightComponent;
