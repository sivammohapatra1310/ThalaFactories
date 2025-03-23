import React from 'react';

export default function DashboardPage() {
  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.mainContainer}>
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>Thala Factories</div>
      <nav style={styles.nav}>
        <a href="/dashboard" style={styles.navLink}>Dashboard</a>
        <a href="/profile" style={styles.navLink}>Profile</a>
        <a href="/settings" style={styles.navLink}>Settings</a>
        <a href="/logout" style={styles.navLink}>Logout</a>
      </nav>
    </header>
  );
}

function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <ul style={styles.sidebarList}>
        <li style={styles.sidebarItem}>
          <a href="/dashboard/overview" style={styles.sidebarLink}>Overview</a>
        </li>
        <li style={styles.sidebarItem}>
          <a href="/dashboard/stats" style={styles.sidebarLink}>Statistics</a>
        </li>
        <li style={styles.sidebarItem}>
          <a href="/dashboard/reports" style={styles.sidebarLink}>Reports</a>
        </li>
        <li style={styles.sidebarItem}>
          <a href="/dashboard/settings" style={styles.sidebarLink}>Settings</a>
        </li>
      </ul>
    </aside>
  );
}

function MainContent() {
  return (
    <main style={styles.main}>
      <h1 style={{ marginBottom: '1rem' }}>Dashboard Overview</h1>
      <p>
        Welcome to your dashboard! Here you can see an overview of your factory operations, stats, reports,
        and more.
      </p>
      {/* Add additional dashboard widgets or content here */}
    </main>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0077ff',
    color: '#fff',
    padding: '0.75rem 1.5rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 500,
  },
  mainContainer: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f0f2f5',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  sidebarList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  sidebarItem: {
    marginBottom: '1rem',
  },
  sidebarLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 500,
  },
  main: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
};

