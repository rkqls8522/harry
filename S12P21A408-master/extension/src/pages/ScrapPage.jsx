import React, { useState } from 'react';
import useScrapStore from '../store/scrapStore';
import '../assets/css/Scrap.css';

function ScrapPage() {
  const { scrapPageInfo, setScrapPageInfo, saveScrap, updateRead } = useScrapStore();
  const [toastMessage, setToastMessage] = useState('');

  const updateIsNotified = (isNotified) => {
    setScrapPageInfo({ ...scrapPageInfo, isNotified });
  };

  const handleSaveScrap = () => {
    saveScrap();
    setToastMessage('해리가 기억했어요!'); // 토스트 메시지 설정
    setTimeout(() => setToastMessage(''), 700); // 0.7초 후 메시지 숨김
  };

  return (
    <div className="page-wrapper space-y-8">
      <div className="w-full bg-white space-y-6">
        {/* 제목 */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">Title</label>
          <input
            type="text"
            value={scrapPageInfo.title || ''}
            onChange={(e) => setScrapPageInfo({ ...scrapPageInfo, title: e.target.value })}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* URL */}
        {/* <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">URL</label>
          <input
            type="text"
            value={scrapPageInfo.url || ''}
            readOnly
            className="w-full px-4 py-2 text-sm border border-gray-300 bg-gray-100 rounded-md text-gray-500 shadow-sm"
          />
        </div> */}

        {/* 이미지 & 아이콘 & 알림 */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">Content Image</label>
          <div className="flex w-full gap-4 items-start">
            {/* 썸네일 (2/3) */}
            <img
              src={scrapPageInfo.image || '/images/default-thumbnail.png'}
              alt="Content"
              className="w-full h-32 object-cover rounded-md border"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          {/* Notification Toggle */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 block">Notification</label>
            <div
              onClick={() => updateIsNotified(!scrapPageInfo.isNotified)}
              className={`relative inline-block w-14 h-8 rounded-full cursor-pointer transition-colors duration-300 ${
                scrapPageInfo.isNotified ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  scrapPageInfo.isNotified ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Read Button */}
          {scrapPageInfo.id ? (
            <button
              onClick={updateRead}
              disabled={scrapPageInfo.isRead}
              className={`h-10 px-6 rounded-xl font-medium shadow-md transition-all ${
                scrapPageInfo.isRead
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {scrapPageInfo.isRead ? '이미 읽음' : '읽기 완료'}
            </button>
          ) : (
            <div className="relative group">
              <button
                onClick={handleSaveScrap}
                className="h-10 px-6 rounded-xl font-medium shadow-md button-primary flex items-center gap-2"
              >
                나중에 읽기
              </button>
            </div>
          )}
        </div>
      </div>
      {toastMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-lg shadow-xl text-center flex items-center gap-3 border border-gray-200">
            <img src="/icons/cat2.png" alt="해리" className="w-6 h-6 rounded-full border border-white bg-white" />
            <span className="text-sm font-medium text-gray-800">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScrapPage;
