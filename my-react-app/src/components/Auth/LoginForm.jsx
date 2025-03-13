// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import InputField from './InputField';
import CaptchaBadge from './CaptchaBadge'; // Optional

function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <InputField
        label="Username or E-mail"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Optional Captcha Badge */}
      <CaptchaBadge />

      <button 
        type="submit" 
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#556b8e',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;
