// src/Welcome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css'; // Import the CSS file

const Welcome = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    navigate('/');
  };

  const navigateToPage = (page) => {
    navigate(`/${page.toLowerCase().replace(/ /g, '-')}`);
  };

  return (
    <div className="welcome-container">
      <main className="main-content">
        <h1>Welcome, {userName}.</h1>
        <div className="buttons-container">
          <button onClick={() => navigateToPage('Recommended Recipes')}>Recommended Recipes</button>
          <button onClick={() => navigateToPage('Recommended Recipes by Genre')}>Recommended Recipes by Genre</button>
          <button onClick={() => navigateToPage('Browse Recipes')}>Browse Recipes</button>
          <button onClick={() => navigateToPage('Previous Ratings')}>Previous Ratings</button>
        </div>
        <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
      </main>
    </div>
  );
};

export default Welcome;
