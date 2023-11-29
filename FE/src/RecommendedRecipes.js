import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipePage.css';

const RecommendedRecipes = () => {
  const navigate = useNavigate();
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const username = localStorage.getItem('userName');

  useEffect(() => {
    // Make an API request to your FastAPI endpoint to get recommended recipes
    fetch(`http://localhost:8000/recommendRecipes/${username}`)
      .then(response => response.json())
      .then(data => {
        setRecommendedRecipes(data.recommendations);
      })
      .catch(error => console.error('Error fetching recommended recipes:', error));
      console.log(recommendedRecipes);
  }, []);
  
  return (
    <div className="recipe-page">
      <button onClick={() => navigate('/welcome')} className="back-button">Back to Welcome</button>
      <h1 className="page-title">Recommended Recipes</h1>
      <div className="recommended-recipes">
        {recommendedRecipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
            <h2>{recipe.title}</h2>
            {/* Add more details or styling as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedRecipes;
