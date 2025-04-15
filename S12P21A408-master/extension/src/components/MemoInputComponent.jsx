import React from 'react';
import '../assets/css/MemoInput.css';

function MemoInputComponent({ value, onChange, onCancel, onSave, isFirst = true, isNew = false }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder="새로운 메모를 입력하세요"
      className={`memo-input ${isNew && !isFirst ? 'mt-3' : ''}`}
    />
  );
}

export default MemoInputComponent;
