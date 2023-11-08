// src/PreviousRatings.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipePage.css';

const PreviousRatings = () => {
  const navigate = useNavigate();

  return (
    <div className="recipe-page">
      <button onClick={() => navigate('/welcome')} className="back-button">Back to Welcome</button>
      <h1 className="page-title">Previous Ratings</h1>
    </div>
  );
};

export default PreviousRatings;
