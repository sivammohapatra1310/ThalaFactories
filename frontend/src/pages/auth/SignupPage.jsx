import React, { useEffect } from 'react';

export default function SignupPage() {
  useEffect(() => {
    // Initialize Google Identity Services for signup page as well if needed
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your client id
        callback: (response) => {
          console.log("Google Sign In Response:", response);
          // Handle the response (e.g., send token to your backend)
        },
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Factory Simulation</h1>

        <form style={styles.form}>
          {/* Username */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              style={styles.input}
            />
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          {/* Create Account Button */}
          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>

        <div style={styles.bottomText}>
          Already have an account? <a href="/login">Sign In</a>
        </div>

        <div style={styles.bottomText}>Or continue with</div>

        {/* Social Sign-In Button (Google only) */}
        <div style={styles.socialContainer}>
          <div id="google-signin-button"></div>
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
    gap: '1rem',
    marginBottom: '1rem',
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
};
