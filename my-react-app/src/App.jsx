import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  console.log('App component rendered');
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

{/* <Route path="/" element={<HomePage />} /> */}