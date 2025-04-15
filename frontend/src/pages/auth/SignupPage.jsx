import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    usertype: ''  // New field for user type
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.username || !formData.password || !formData.confirmPassword || !formData.usertype) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Sending signup request with:', {
        username: formData.username,
        password: '********',
        usertype: formData.usertype
      });
      
      const response = await fetch('https://tfss-backend-nbwb.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          usertype: formData.usertype  // Sending the user type with signup data
        })
      });
      
      console.log('Response status:', response.status);
      
      // Get response as text first
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // Only try to parse if there's content
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      // Redirect to login page on success
      console.log('Signup successful!');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Factory Simulation</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form style={styles.form} onSubmit={handleSubmit}>
          {/* Username */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              style={styles.input}
              value={formData.username}
              onChange={handleChange}
              minLength="3"
              maxLength="20"
            />
          </div>
          
          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
              minLength="6"
            />
          </div>
          
          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              style={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength="6"
            />
          </div>
          
          {/* User Type */}
          <div style={styles.formGroup}>
            <label style={styles.label}>User Type</label>
            <select
              name="usertype"
              style={styles.input}
              value={formData.usertype}
              onChange={handleChange}
              required
            >
              <option value="">Select user type</option>
              <option value="factory head">Factory Head</option>
              <option value="factory manager">Factory Manager</option>
              <option value="adjuster">Adjuster</option>
            </select>
          </div>
          
          {/* Create Account Button */}
          <button 
            type="submit" 
            style={loading ? {...styles.button, opacity: 0.7} : styles.button}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={styles.bottomText}>
          Already have an account? <a href="/login">Sign In</a>
        </div>
        
        {/* Privacy / Terms */}
        <div style={styles.privacyTerms}>
          <a href="/privacy">Privacy</a> • <a href="/terms">Terms</a>
        </div>
        
        {/* Footer */}
        <div style={styles.footer}>© 2024 Thala Factories</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    boxSizing: 'border-box',
  },
  title: {
    margin: 0,
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.25rem',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#0077ff',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  bottomText: {
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  privacyTerms: {
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  footer: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#888',
  },
  error: {
    color: '#e53e3e',
    backgroundColor: '#fed7d7',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center',
  }
};
