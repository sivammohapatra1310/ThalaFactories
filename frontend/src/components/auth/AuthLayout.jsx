import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{title}</h2>
        {children}
      </div>
      <footer style={styles.footer}>
        <div>
          <Link to="/privacy" style={styles.link}>Privacy</Link>
          {' • '}
          <Link to="/terms" style={styles.link}>Terms</Link>
        </div>
        <p>&copy; 2024 Thala Factories. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '2rem',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  footer: {
    marginTop: '2rem',
    fontSize: '0.8rem',
    color: '#888',
    textAlign: 'center',
  },
  link: {
    color: '#0077ff',
    textDecoration: 'none',
  },
};
