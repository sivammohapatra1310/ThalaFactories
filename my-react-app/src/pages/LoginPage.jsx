// src/pages/LoginPage.jsx
import React from 'react';
import Logo from '../components/Auth/Logo';
import LoginForm from '../components/Auth/LoginForm';
// import SocialLogin from '../components/Auth/SocialLogin'; // Optional

function LoginPage() {
  const handleLogin = (credentials) => {
    // Perform actual login logic or API call
    // e.g., axios.post('/api/auth/login', credentials)
    console.log('Logging in with:', credentials);
  };

  return (
    <div 
      className="login-page" 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <div 
        className="login-container" 
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Logo />
        <LoginForm onSubmit={handleLogin} />
        
        <div 
          className="auth-links" 
          style={{ marginTop: '1rem', textAlign: 'center' }}
        >
          <a href="/forgot-password" style={{ marginRight: '1rem' }}>Forgot Password?</a>
          <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
