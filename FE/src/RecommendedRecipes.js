import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipePage.css';

const RecommendedRecipes = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
  const fetchRecipes = async () => {
    const url = `http://127.0.0.1:8000/rate_random_recipes/${userName}`;

    try {
      const response = await fetch(url);
      console.log(response);
      const data = await response.json();
      setRecipes(data);
      console.log(recipes);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };
  fetchRecipes();
}, []);
  return (
    <div className="recipe-page">
      <button onClick={() => navigate('/welcome')} className="back-button">Back to Welcome</button>
      <h1 className="page-title">Recommended Recipes</h1>
      <div className="recipes-container">
        
      </div>
    </div>
  );
};

export default RecommendedRecipes;
