import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

  const handleGetStarted = () => {
    // For example, navigate to the login page
    navigate('/login');
  };
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Factory Simulation</h1>
        <p style={styles.paragraph}>
          Welcome to Thala Factories! Manage and optimize your production lines 
          efficiently. Explore our platform to find the latest metrics, 
          productivity insights, and more.
        </p>
        <button style={styles.button} onClick={handleGetStarted}>
          Get Started
        </button>
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
    maxWidth: '600px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    fontWeight: 600,
  },
  paragraph: {
    marginBottom: '1.5rem',
    fontSize: '1rem',
    lineHeight: 1.5,
    color: '#333',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0077ff',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
