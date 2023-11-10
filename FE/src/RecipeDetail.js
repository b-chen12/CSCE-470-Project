// src/RecipeDetail.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RecipeDetail.css'; // Assuming you have specific styles for this page

const RecipeDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe;

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  // Function to handle navigation to a recommended recipe
  const handleRecommendedRecipeClick = (recommendedRecipeId) => {
    // Navigate to the detail page of the recommended recipe
    navigate(`/recipes/${recommendedRecipeId}`, { state: { /* fetch or find the recipe data */ } });
  };

  return (
    <div className="recipe-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      {/* Display other important details of the recipe */}
      <div className="recommended-recipes">
        {/* Assuming you have a list of recommended recipe IDs */}
        {recipe.recommendedRecipes.map(id => (
          <div key={id} onClick={() => handleRecommendedRecipeClick(id)}>
            {/* Display recommended recipe summary */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeDetail;
