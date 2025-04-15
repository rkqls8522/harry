import React from 'react';
import MemoItemComponent from './MemoItemComponent';
import useHighlightStore from '../store/highlightStore';

function MemoListComponent({ highlightId }) {
  const { memos, updateMemo, deleteMemo } = useHighlightStore();

  const handleDeleteMemo = (memoId) => {
    deleteMemo(highlightId, memoId);
  };

  const handleUpdateMemo = (memoId, updatedMemo) => {
    updateMemo(highlightId, memoId, updatedMemo);
  };

  if (memos[highlightId].length === 0) return null;

  return (
    <div className="space-y-2">
      {memos[highlightId].map((memo) => (
        <MemoItemComponent key={memo.id} memo={memo} onDelete={handleDeleteMemo} onEdit={handleUpdateMemo} />
      ))}
    </div>
  );
}

export default MemoListComponent;
