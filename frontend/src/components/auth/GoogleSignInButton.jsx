import React, { useEffect } from 'react';

const GoogleSignInButton = ({ onSignIn }) => {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, // or your client ID directly
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, []);

  const handleCredentialResponse = (response) => {
    console.log('Google ID Token:', response.credential);
    if (onSignIn) {
      onSignIn(response.credential);
    }
  };

  return <div id="google-signin-button"></div>;
};

export default GoogleSignInButton;
