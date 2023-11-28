// src/PreviousRatings.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipePage.css';

const PreviousRatings = () => {
  const navigate = useNavigate();
  
  const userName = localStorage.getItem('userName');
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      const url = `http://127.0.0.1:8000/userRatings/${userName}`;

      try {
        const response = await fetch(url);
        console.log(response);
        const data = await response.json();
        console.log(data);
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };
    fetchRatings();
    
    console.log(recipes);
  }, []);

  return (
    <div className="recipe-page">
      <button onClick={() => navigate('/welcome')} className="back-button">Back to Welcome</button>
      <h1 className="page-title">Previous Ratings</h1>
      <div className="recipes-container">
        {recipes.map((recipe) => (
          <div key={recipe.RecipeId} className="recipe" onClick={() => navigate(`/recipes/${recipe.RecipeId}`)}>
          <h3>{recipe.Rating}</h3>
        </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousRatings;
