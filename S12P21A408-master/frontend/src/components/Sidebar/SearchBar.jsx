// src/components/common/SearchBar.jsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css'; // 또는 기존 Sidebar.css에서 필요한 스타일만 분리
import useArchiveStore from '../../store/archiveStore';

const SearchBar = ({ placeholder = '', disabled = false }) => {
  const { searchArchives } = useArchiveStore();

  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    searchArchives({ keyword: value });
    setSearchValue('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (!disabled && e.key === 'Enter') {
              handleSearch(searchValue);
            }
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SearchBar;
