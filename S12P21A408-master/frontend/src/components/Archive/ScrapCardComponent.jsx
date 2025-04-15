import React from 'react';
import { Bookmark, BookmarkCheck, CircleCheck, Circle } from 'lucide-react';
import harryNoImage from '../../assets/harry_noImage.png';
import useScrapStore from '../../store/scrapStore';
import toast, { Toaster } from 'react-hot-toast';

function ScrapCardComponent({ item }) {
  const { updateScrapIsRead } = useScrapStore();
  const handleClick = () => {
    // 새로운 탭에서 item.url 열기
    window.open(item.url, '_blank');
  };

  const handleToggleRead = (e) => {
    e.stopPropagation(); // 카드 클릭 방지
    const newStatus = !item.isRead;
    updateScrapIsRead(item.id, newStatus);
    toast(newStatus ? '읽음으로 설정했어요!' : '읽지 않음으로 설정했어요!', {
      icon: newStatus ? '💡' : '🧹',
      style: {
        borderRadius: '12px',
        background: '#e6f2ff',
        color: '#007BE5',
        fontWeight: '500',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
        backdropFilter: 'blur(2px)',
      },
    });
  };

  return (
    <>
      {/* ✅ 반드시 컴포넌트 안에 Toaster 포함 */}
      <Toaster position="bottom-center" toastOptions={{ duration: 1000 }} />

      <div
        onClick={handleClick}
        className="relative flex flex-col bg-white rounded-xl shadow hover:shadow-md transition-all border border-gray-100 overflow-hidden cursor-pointer"
      >
        {/* 이미지 */}
        <div className="w-full h-[160px] bg-white flex items-center justify-center overflow-hidden">
          <img
            src={item.image || harryNoImage} // 이미지가 null 또는 undefined일 경우 기본 이미지 사용
            alt={item.title || 'No Image'}
            className="w-full h-full object-scale-down"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = harryNoImage;
            }}
          />
        </div>

        {/* 본문 */}
        <div className="flex flex-col justify-between p-4 h-[140px]">
          <div className="flex justify-between items-start">
            <h3 className="text-lg text-gray-800 line-clamp-2">{item.title}</h3>
            <button
              onClick={handleToggleRead}
              className="ml-2 mt-2 p-1 rounded-full hover:bg-gray-100 transition"
              title={item.isRead ? '읽음 해제' : '읽음 처리'}
            >
              <CircleCheck className={`w-5 h-5 ${item.isRead ? 'text-green-600' : 'text-gray-300'}`} />
            </button>
          </div>
          <div className="text-[11px] text-gray-400 mt-2">{item.createdAt.split('T')[0].replace(/-/g, '.')}</div>
        </div>
      </div>
    </>
  );
}

export default ScrapCardComponent;
