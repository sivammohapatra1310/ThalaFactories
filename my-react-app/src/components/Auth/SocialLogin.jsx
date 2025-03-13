// src/components/Auth/SocialLogin.jsx
import React from 'react';

function SocialLogin() {
  return (
    <div className="social-login" style={{ textAlign: 'center', marginTop: '1rem' }}>
      <p style={{ margin: '0.5rem 0' }}>or you can sign in with</p>
      <div>
        <button style={{ margin: '0 0.5rem' }}>G</button>
        <button style={{ margin: '0 0.5rem' }}>F</button>
        <button style={{ margin: '0 0.5rem' }}>GitHub</button>
      </div>
    </div>
  );
}

export default SocialLogin;
