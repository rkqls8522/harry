import React, { useEffect, useRef, useState } from 'react';
import PageCardListComponent from '../components/PageRecommend/PageCardListComponent';
import TagComponent from '../components/common/TagComponent';
import pageRecoStore from '../store/pageRecoStore';
import pageRecommendStore from '../store/pageRecommendStore';
import { Loader2 } from 'lucide-react';

function PageRecoListPage() {
  const { keywords, isLoadingKeywords, fetchKeywords, fetchPlatforms } = pageRecoStore();
  const { fetchRecommendPages, setSelectedKeywords, setSelectedPlatform, nextPage } = pageRecommendStore();
  const { pages } = pageRecommendStore((state) => state);
  const { isLoading } = pageRecommendStore((state) => state);
  const targetRef = useRef(null);
  const nextPageRef = useRef(nextPage);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [isLastPages, setIsLastPages] = useState(false);

  useEffect(() => {
    // TODO: 페이지 첫 등장 시점에 fetchKeywords, fetchPlatforms 호출 완료 후 맨 처음 keyword와 platform으로 recoomendPage 호출
    // fetchRecommendPages({ platform: 'all', offset: 0, keywords: [] });
    // setSeletectedKeywords([{ id: 17, name: 's12' }]);

    const initialize = async () => {
      try {
        setSelectedKeywords([]); // 초기화 시 선택된 키워드 초기화
        setSelectedPlatform(null); // 초기화 시 선택된 플랫폼 초기화
        const firstKeywords = await fetchKeywords();

        if (!firstKeywords) {
          console.log('저장된 키워드가 없습니다');
          return;
        }
        const firstPlatforms = await fetchPlatforms();
        const firstKeyword = firstKeywords[0]; // 기본 키워드 설정
        const firstPlatform = firstPlatforms[0]?.name; // 기본 플랫폼 설정

        console.log('First Keyword:', firstKeyword);
        console.log('First Platform:', firstPlatform);

        setSelectedKeywords([firstKeyword]);
        setSelectedPlatform(firstPlatform);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initialize();
  }, [fetchKeywords, fetchPlatforms, fetchRecommendPages, setSelectedKeywords, setSelectedPlatform]);

  // 최신 nextPage를 ref에 업데이트
  useEffect(() => {
    nextPageRef.current = nextPage;
  }, [nextPage]);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const target = targetRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log('스크롤 하단 도달');

          if (!isLoading && pages.length / 8 !== 0) {
            setLoadingVisible(true);
            console.log('다음 페이지 로드');
            if (nextPageRef.current) {
              nextPageRef.current((error, data) => {
                if (error || !Array.isArray(data)) {
                  setLoadingVisible(false);
                } else if (data.length === 0) {
                  setLoadingVisible(false);
                  setIsLastPages(true);
                }
              });
            }
          }
        } else setLoadingVisible(false);
      },
      { threshold: 0.5 }, // 타겟이 100% 보이면 실행
    );

    // 지정 dom 요소에 변화 감지
    if (target) {
      observer.observe(target);
    }

    // 감지 중단
    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [pages]);

  return (
    <div className="main">
      <TagComponent
        tags={keywords.map((k) => ({
          id: k.id,
          name: k.keyword,
        }))}
        setSelected={setSelectedKeywords}
        loading={isLoadingKeywords}
        minSelectable={1}
        autoSelectFirst={true} // 첫 번째 태그를 기본 선택 상태로 설정
      />
      <PageCardListComponent pages={pages} loading={isLoading} />
      <div ref={targetRef} style={{ height: '300px' }}>
        {loadingVisible ? (
          <div className="loading-container">
            <div className="loading-content">
              <Loader2 className="loading-icon animate-spin" />
              <p className="loading-text">페이지를 불러오는 중</p>
            </div>
          </div>
        ) : (
          isLastPages && <div className="text-center text-sm text-gray-400 mt-4">추천 페이지가 없습니다.</div>
        )}
      </div>
      {/* trigger 역할 */}
    </div>
  );
}

export default PageRecoListPage;
