import React, { useEffect } from 'react';
import { MemoryRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import HighlightPage from './pages/HighlightPage';
import ScrapPage from './pages/ScrapPage';
import RecommendPage from './pages/RecommendPage';
import useScrapStore from './store/scrapStore';
import useHighlightStore from './store/highlightStore';
import './assets/css/App.css';
import { Highlighter, Bookmark, WandSparkles, House } from 'lucide-react';
import useAuthStore from './store/authStore';

function App() {
  const { fetchScrap, setIcon } = useScrapStore();
  const { fetchHighlights } = useHighlightStore();
  const { setPageInfo, setVisitRecord } = useAuthStore();

  useEffect(() => {
    // Fetch pageInfo from the background script
    console.log('Popup view loaded');
    chrome.runtime.sendMessage({ type: 'PAGE_INFO', action: 'GET' }, (response) => {
      if (response && response.pageInfo) {
        setPageInfo(response.pageInfo);
        setVisitRecord(response.hasVisitRecord);
        fetchScrap(response.pageInfo.url, response.pageInfo);
        fetchHighlights(response.pageInfo.url);
        setIcon(response.pageInfo.icon);
      }
    });
  }, [setPageInfo, setVisitRecord, fetchScrap, fetchHighlights, setIcon]);

  return (
    <Router initialEntries={['/highlight']} initialIndex={0}>
      <div className="container">
        <nav className="px-6 pt-3 pb-1 flex items-center justify-between rounded-t-xl">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-full shadow-sm w-full">
            {[
              { to: '/highlight', label: 'highlight', icon: <Highlighter size={16} className="inline-block" /> },
              { to: '/scrap', label: 'bookmark', icon: <Bookmark size={16} className="inline-block" /> },
              { to: '/recommend', label: 'recommend', icon: <WandSparkles size={16} className="inline-block" /> },
            ].map(({ to, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-1 px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                    isActive ? 'bg-[#007BE5] text-[#FFFFFF]' : 'text-gray-500 hover:bg-gray-200 hover:text-[#007BE5]'
                  } w-1/4`
                } // 1/4 너비 배치
              >
                {icon}
              </NavLink>
            ))}
            {/* 링크 버튼 */}
            <button
              className="flex items-center justify-center gap-1 px-4 py-1.5 text-sm font-medium rounded-full transition-all text-gray-500 hover:bg-gray-200 hover:text-blue-600 w-1/4"
              onClick={() => {
                chrome.tabs.create({ url: 'https://j12a408.p.ssafy.io/' });
              }}
            >
              <House size={16} className="inline-block" />
            </button>
          </div>
        </nav>
        <Routes>
          <Route path="/highlight" element={<HighlightPage />} />
          <Route path="/scrap" element={<ScrapPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
