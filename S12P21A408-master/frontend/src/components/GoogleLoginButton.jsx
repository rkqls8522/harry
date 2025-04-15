import React from 'react';

function GoogleLoginButton() {
  const BACKEND_URL = 'https://j12a408.p.ssafy.io';

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorize/google`;
  };

  return (
    <button className="google-login-button" onClick={handleGoogleLogin}>
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="google-icon" />
      Google로 로그인
    </button>
  );
}

export default GoogleLoginButton;
