import React from 'react';
import { Link } from 'react-router-dom';
import GoogleSignInButton from './GoogleSignInButton';

export default function AuthForm({ isLogin }) {
  return (
    <form style={styles.form}>
      {/* Username Field */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Username</label>
        <input type="text" placeholder="Enter your username" style={styles.input} />
      </div>
      {/* Password Field */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Password</label>
        <input type="password" placeholder="••••••••" style={styles.input} />
      </div>
      <button type="submit" style={styles.button}>
        {isLogin ? 'Sign In' : 'Create Account'}
      </button>
      <div style={styles.bottomText}>
        {isLogin ? (
          <>
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            Already have an account? <Link to="/login">Sign In</Link>
          </>
        )}
      </div>
      <div style={styles.bottomText}>Or continue with</div>
      <div style={styles.socialContainer}>
        <GoogleSignInButton onSignIn={(token) => console.log('Google token', token)} />
        <MicrosoftSignInButton onSignIn={(response) => console.log('Microsoft response', response)} />
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
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
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
  socialContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
};
