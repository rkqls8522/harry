// import React, { useEffect } from 'react';
import MenuItem from './MenuItem';
import './Menu.css';
import pageRecoStore from '../../store/pageRecoStore';

const MenuList = ({ setSelected }) => {
  const { platforms, fetchPlatforms, removePlatform } = pageRecoStore();

  // useEffect(() => {
  //   fetchPlatforms().then((fetchedPlatforms) => {
  //     console.log('디버깅 platforms: ', fetchedPlatforms);
  //     setSelected(fetchedPlatforms);
  //   });
  // }, []);

  const handlePlatformClick = (platformName) => {
    setSelected(platformName);
  };

  const handlePlatformDelete = (platformId) => {
    if (platforms.length === 1) {
      alert('플랫폼을 하나 이상 선택해야 합니다.');
      return;
    }

    removePlatform(platformId, () => {
      fetchPlatforms().then((updatedPlatforms) => {
        const firstPlatform = updatedPlatforms[0]?.name;
        setSelected(firstPlatform);
      });
    });
  };

  const getFaviconUrl = (domain) => {
    return `https://www.google.com/s2/favicons?domain=https://${domain}&sz=16`;
  };

  const menuItems =
    platforms?.map((p) => ({
      id: p.platformId,
      label: p.name,
      faviconUrl: getFaviconUrl(p.name),
    })) || [];

  return (
    <div>
      <div className="tag-list-grouped space-y-4">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            to="#"
            label={
              <>
                <img src={item.faviconUrl} alt={`${item.label} favicon`} className="inline-block mr-2 w-4 h-4" />
                {item.label.split('.')[0]}
              </>
            }
            originalLabel={item.label}
            onClick={() => handlePlatformClick(item.label)}
            onDelete={() => handlePlatformDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuList;
