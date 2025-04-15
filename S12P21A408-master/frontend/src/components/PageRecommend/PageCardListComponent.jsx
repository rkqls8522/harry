import React from 'react';
import { Loader2 } from 'lucide-react';
import noContentImage from '../../pages/HSJcomponent/HSJasset/no_content.png';
import './Card.css';
import PageCard from './PageCard.jsx';

function PageCardListComponent({ pages = [], loading = false }) {
  return (
    <div className="page-card-list-container max-w-6xl mx-auto px-1 min-h-[800px]">
      {loading && pages.length === 0 ? (
        <div className="loading-container">
          <div className="loading-content">
            <Loader2 className="loading-icon animate-spin" />
            <p className="loading-text">페이지를 불러오는 중</p>
          </div>
        </div>
      ) : pages.length === 0 ? (
        <div className="empty-container">
          <div className="empty-content">
            <img src={noContentImage} alt="No content" className="empty-image" />{' '}
          </div>
        </div>
      ) : (
        <div className="card-grid">
          {pages.map((page, index) => (
            <PageCard key={index} data={page} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PageCardListComponent;
