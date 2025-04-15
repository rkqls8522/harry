import React from 'react';
import './LoginPage.css';
import catImage from '../assets/cat.png';
import GoogleLoginButton from '../components/GoogleLoginButton';

function LoginPage() {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <div className="login-left-content">
            <h1>브라우저 친구, 해리</h1>
            <p>해리와 함께라면 웹 탐색이 더욱 즐거워집니다.</p>

            <div className="cat-illustration">
              <img src={catImage} alt="해리 캐릭터" className="cat-image" />
              <div className="cat-quote">
                <b> 함께 시작해볼까요?</b>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-right-content">
            <div className="login-icon">📝</div>
            <h2>
              해리와 함께하는
              <br />
              스마트한 웹 탐색
            </h2>
            <p className="login-description">시작하려면 로그인하세요</p>

            <GoogleLoginButton />

            <p className="terms-text">
              <a href="/terms">서비스 약관</a>과 <a href="/privacy">개인정보 처리방침</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
