// src/components/Auth/CaptchaBadge.jsx
import React from 'react';

function CaptchaBadge() {
  return (
    <div className="captcha-badge" style={{
      backgroundColor: '#F0FFF0',
      border: '1px solid #00cc00',
      padding: '1rem',
      margin: '1rem 0'
    }}>
      <p style={{ color: '#009900', margin: 0 }}>Success!</p>
      {/* If you have an image or icon for Cloudflare */}
      <small>Cloudflare</small>
    </div>
  );
}

export default CaptchaBadge;
