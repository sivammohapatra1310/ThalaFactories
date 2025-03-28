import React, { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "246081054303-tpkqfprt3lumar3l2gpp2o9441186gi0.apps.googleusercontent.com",
          callback: handleGoogleSignIn,
          auto_select: false,
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: "300"
          }
        );
      }
    };

    const handleGoogleSignIn = (response) => {
        try {
          if (response.error) {
            throw new Error(response.error);
          }
          
          // Verify the token with your backend
          const { credential } = response;
          
          // Add this fetch call INSIDE the handleGoogleSignIn function
          fetch('/api/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: credential }),
          })
          .then(response => response.json())
          .then(data => {
            // Handle successful login (store token, redirect, etc.)
            console.log("Login successful:", data);
            // Example: redirect to dashboard
            window.location.href = '/dashboard';
          })
          .catch(error => {
            console.error('Login failed:', error);
            // Show error message to user
          });
        } catch (error) {
          console.error('Google Sign-In Error:', error);
          // Handle errors here
        }
      };
    // Check if Google script is loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Add fallback in case script takes time to load
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        initializeGoogleSignIn();
      };
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

          {/* Sign In Button */}
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>

        <div style={styles.bottomText}>
          Don’t have an account? <a href="/signup">Sign Up</a>
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
    margin: '1rem 0',
    // These nested styles will target the Google button elements
    '& div': {  // First div - container
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      '& div': {  // Second div - actual button
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
