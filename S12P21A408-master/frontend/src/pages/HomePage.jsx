import React, { useEffect } from 'react';
import './HomePage.css';
import useAuthStore from '../store/authStore';
import One from './HSJcomponent/one';
import Zero from './HSJcomponent/zero';
import Two from './HSJcomponent/two';
import Three from './HSJcomponent/three';
import Four from './HSJcomponent/four';
import Five from './HSJcomponent/five.jsx';
import BackgroundImages from './HSJcomponent/BackgroundImages';

function HomePage() {
  const { user, fetchMyInfo } = useAuthStore();

  useEffect(() => {
    console.log('HomePage mounted');
    fetchMyInfo();
  }, [fetchMyInfo]);

  return (
    <div className="home-container">
      <BackgroundImages />
      <main className="home-content">
        {user ? (
          // 로그인된 경우: Zero와 Five만 보여줌
          <>
            <section className="section">
              <Zero />
            </section>
          </>
        ) : (
          // 로그인되지 않은 경우: One부터 Five까지 모두 보여줌
          <>
            <section className="section">
              <One />
            </section>
            <section className="section">
              <Two />
            </section>
            <section className="section">
              <Three />
            </section>
            <section className="section">
              <Four />
            </section>
            <section className="section">
              <Five />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default HomePage;
