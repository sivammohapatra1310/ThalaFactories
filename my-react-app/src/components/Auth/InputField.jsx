// src/components/Auth/InputField.jsx
import React from 'react';

function InputField({ label, type, value, onChange }) {
  return (
    <div className="input-group" style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', marginBottom: '.5rem' }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        style={{
          width: '100%',
          padding: '0.5rem',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}

export default InputField;
