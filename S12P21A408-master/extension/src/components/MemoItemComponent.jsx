import React, { useState } from 'react';
import MemoInputComponent from '../components/MemoInputComponent';

function MemoItemComponent({ memo, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(memo.content);

  return (
    <div className="flex items-start justify-between text-sm text-gray-600 whitespace-pre-line gap-2">
      {isEditing ? (
        <div className="flex flex-col gap-1 w-full">
          <MemoInputComponent
            value={edited}
            onChange={(e) => setEdited(e.target.value)}
            onCancel={() => {
              setIsEditing(false);
            }}
            onSave={() => {
              onEdit(memo.id, edited);
              setIsEditing(false);
            }}
          />
        </div>
      ) : (
        <>
          <p className="flex-1" style={{ fontSize: '0.9rem' }}>
            {memo.content}
          </p>
          <div className="flex-shrink-0 flex gap-2 text-xs text-gray-400">
            <button onClick={() => setIsEditing(true)} className="hover:text-blue-600">
              수정
            </button>
            <button onClick={() => onDelete(memo.id)} className="hover:text-red-500">
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MemoItemComponent;
