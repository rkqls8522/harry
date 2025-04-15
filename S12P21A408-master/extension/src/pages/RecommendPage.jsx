import React, { useEffect } from 'react';
import useRecommendStore from '../store/recommendStore';
import '../assets/css/Recommend.css';
import useAuthStore from '../store/authStore';

function RecommendPage() {
  const { fetchRecommend, isRecommend, recommends, keyword, historyError } = useRecommendStore();
  const { pageInfo } = useAuthStore();

  useEffect(() => {
    fetchRecommend(pageInfo.url);
  }, [fetchRecommend, pageInfo.url]);

  if (historyError) {
    return (
      <div className="page-wrapper flex flex-col items-center justify-center text-gray-500 space-y-4">
        <img src="/icons/sad.png" alt="harry" className="w-24 h-24 mb-4" />
        <p className="text-lg font-medium">해리가 아직 준비되지 않았어요.</p>
        <p className="text-sm text-gray-400">홈페이지에 방문하여 방문기록을 주세요!</p>
      </div>
    );
  } else if (!isRecommend) {
    return (
      <div className="page-wrapper flex flex-col items-center justify-center text-gray-500 space-y-4">
        <img src="/icons/sad.png" alt="harry" className="w-24 h-24 mb-4" />
        <p className="text-lg font-medium">이번엔 추천할 게 없어요.</p>
        <p className="text-sm text-gray-400">다른 페이지에선 해리가 더 잘 도와줄 수 있어요!</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper space-y-5 max-w-4xl mx-auto px-4">
      {/* 타이틀 */}
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold text-gray-800">해리가 추천하는</p>
        <p className="keyword">{keyword}</p>
        <p className="text-2xl font-bold text-gray-800">컨텐츠예요!</p>
      </div>

      {/* 카드 목록 */}
      <div className="flex flex-col gap-3">
        {recommends.map((recommend, index) => (
          <a
            key={index}
            href={recommend.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition flex items-center p-3 gap-4"
          >
            {/* 썸네일 이미지 */}
            <img
              src={recommend.thumbnail || '/images/default-thumbnail.png'}
              alt={recommend.title}
              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
            />

            {/* 텍스트 */}
            <div className="overflow-hidden">
              <p className="text-base font-semibold text-gray-900 truncate">{recommend.title}</p>
              <p className="text-sm text-gray-500 truncate">{recommend.domain}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default RecommendPage;
