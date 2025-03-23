import React, { useEffect } from 'react';

export default function SignupPage() {
  const handleGoogleSignIn = (response) => {
    try {
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Verify the token with your backend
      const { credential } = response;
      console.log("Google Sign-In Credential:", credential);
      
      // Example API call for signup
      fetch('/api/auth/google-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      })
      .then(response => response.json())
      .then(data => {
        console.log("Signup successful:", data);
        // Redirect to login or dashboard
      })
      .catch(error => {
        console.error('Signup failed:', error);
      });
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
          context: 'signup'
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signup-button"),
          {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signup_with",
            width: "300"
          }
        );
      }
    };

    if (window.google) {
      initializeGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    }
  }, []);

  // Rest of your component remains the same...

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
  <div id="google-signup-button"></div>
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
    '& div': {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      '& div': {
        width: '100% !important',
        borderRadius: '4px !important',
        height: '40px !important'
      }
    }
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
