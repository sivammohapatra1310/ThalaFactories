import { Link } from 'react-router-dom';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <header className="auth-header">
        <Link to="/" className="logo">
          {/* Add your logo image here */}
          <span>Factory Simulation</span>
        </Link>
      </header>
      <main className="auth-content">
        {children}
      </main>
      <footer className="auth-footer">
        <p>Privacy • Terms</p>
        <p>&copy; 2024 Thala Factories</p>
      </footer>
    </div>
  );
}