import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Backend base URL - should match your backend server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usertype, setUsertype] = useState(''); // state variable and function to update it

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    //await- code will pause here until the request completes
    // fetch- modern JavaScript function for making HTTP requests
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, usertype }),
      });

      const data = await response.json();

      if (response.ok) {
        // User exists and credentials are correct
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard
        navigate('/dashboard');
      } else if (response.status === 404) {
        // User doesn't exist, redirect to signup page
        setError('Account not found. Redirecting to signup...');
        setTimeout(() => {
          navigate('/signup', { state: { username } }); // Pass username to signup page
        }, 2000);
      } else {
        // Other errors (invalid credentials, server error, etc.)
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Factory Simulation</h1>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        <form style={styles.form} onSubmit={handleLogin}>
          {/* Username */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>User Type</label>
            <select
              name="usertype"
              style={styles.input}
              value={usertype}
              onChange={(e) => setUsertype(e.target.value)}
              required
            >
              <option value="">Select your user type</option>
              <option value="factory head">Factory Head</option>
              <option value="factory manager">Factory Manager</option>
              <option value="adjuster">Adjuster</option>
            </select>
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.bottomText}>
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
        {/* Privacy / Terms */}
        <div style={styles.privacyTerms}>
          <a href="#privacy">Privacy</a> • <a href="#terms">Terms</a>
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
  socialContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '1rem 0',
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
  errorMessage: {
    backgroundColor: '#fff8f8',
    color: '#e53e3e',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center',
    border: '1px solid #fed7d7',
  }
};