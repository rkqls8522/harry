import React from 'react';
import ArchiveCardListComponent from '../components/Archive/ArchiveCardListComponent';
import ScrapCardListComponent from '../components/Archive/ScrapCardListComponent';
import useArchiveStore from '../store/archiveStore';

function ArchiveListPage() {
  const { selectedTab } = useArchiveStore();

  if (selectedTab === 'scrap') {
    return <ScrapCardListComponent />;
  }
  return <ArchiveCardListComponent />;
}

export default ArchiveListPage;
