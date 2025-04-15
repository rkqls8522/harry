import React from 'react';
import { Pin } from 'lucide-react';
import pageRecommendStore from '../../store/pageRecommendStore';

// originalLabel 매개변수를 추가합니다
const MenuItem = ({ label, onClick, onDelete, originalLabel }) => {
  const { selectedPlatform } = pageRecommendStore();
  // originalLabel이 제공되면 사용하고, 그렇지 않으면 label을 그대로 사용
  const labelToCompare = originalLabel || (typeof label === 'string' ? label : '');
  const isActive = selectedPlatform === labelToCompare;

  return (
    <ul className="tag-list">
      <li className="menu-item">
        <div className={`tag-item ${isActive ? 'active' : ''}`} onClick={onClick}>
          <div className="left-content">
            <span className="menu-label">{label}</span>
          </div>
          {onDelete && (
            <div
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation(); // 부모 클릭 방지
                onDelete();
              }}
            >
              <Pin size={16} fill={isActive ? 'white' : 'none'} />
            </div>
          )}
        </div>
      </li>
    </ul>
  );
};

export default MenuItem;
