// src/RecommendedRecipes.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipePage.css';

const RecommendedRecipes = () => {
  const navigate = useNavigate();

  return (
    <div className="recipe-page">
      <button onClick={() => navigate('/welcome')} className="back-button">Back to Welcome</button>
      <h1 className="page-title">Recommended Recipes</h1>
    </div>
  );
};

export default RecommendedRecipes;
