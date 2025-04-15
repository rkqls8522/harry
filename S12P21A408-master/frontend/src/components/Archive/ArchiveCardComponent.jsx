import React from 'react';
import { StickyNote, MessageSquare, Highlighter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import harryNoImage from '../../assets/harry_noImage.png';

function ArchiveCardComponent({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/archives/${item.archiveId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col h-[200px] md:flex-row gap-4 bg-white overflow-hidden border-b-2 border-gray-100"
    >
      <div className="flex-1 p-6 space-y-2 flex flex-col justify-between">
        <div>
          {/* 제목 */}
          <div className="flex justify-between items-start">
            <p className="text-xl line-clamp-1">{item.title}</p> {/* 최대 1줄로 제한 */}
          </div>

          {/* URL */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
            <img
              src={`https://www.google.com/s2/favicons?domain=${item.url}&sz=16`}
              alt="favicon"
              className="w-4 h-4"
            />
            {(() => {
              try {
                return new URL(item.url).hostname;
              } catch {
                return 'Invalid URL';
              }
            })()}
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mt-6 overflow-hidden max-h-[30px]">
            {item.tags.slice(0, 5).map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200"
              >
                {tag.name}
              </span>
            ))}
            {item.tags.length > 5 && (
              <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-300">
                +{item.tags.length - 5}
              </span>
            )}
          </div>
          {/* <div className="flex flex-wrap gap-2 mt-6 overflow-hidden min-h-[30px]">
            {item.tags.length > 0 ? (
              item.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                >
                  {tag.name}
                </span>
              ))
            ) : (
              <div className="min-h-[30px]"></div>
            )}
          </div> */}
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-400 mt-4">{item.createdAt.split('T')[0].replace(/-/g, '.')}</div>

          {(item.highlightInfo.count > 0 || item.note) && (
            <div className="flex items-center gap-2">
              {/* ✅ 하이라이트 표시 뱃지 */}
              {item.highlightInfo.count > 0 && (
                <div className="flex items-center gap-1 text-gray-500 text-sm font-medium">
                  {/* 겹쳐진 색상 점들 */}
                  <div className="flex -space-x-2">
                    {item.highlightInfo.colors.slice(0, 4).map((color, idx) => (
                      <span
                        key={idx}
                        className="w-5 h-5 rounded-full border border-white"
                        style={{
                          backgroundColor: color.startsWith('#') ? color : undefined,
                          borderWidth: '1px',
                        }}
                      />
                    ))}
                  </div>

                  <span className="ml-1 text-xs">{item.highlightInfo.count}</span>
                  <Highlighter size={16} strokeWidth={2} className="text-gray-500" />
                </div>
              )}

              {/* ✅ 메모 아이콘 뱃지 */}
              {item.note && (
                <div className="flex items-center gap-1 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">
                  <MessageSquare size={16} strokeWidth={2} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-[300px] h-[200px] flex-shrink-0">
        <img
          src={item.image}
          alt="thumbnail"
          className="w-full h-full object-scale-down bg-white"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = harryNoImage; // 기본 이미지 경로 설정
          }}
        />
      </div>
    </div>
  );
}

export default ArchiveCardComponent;
