import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipePage.css';

const BrowseRecipes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (searchQuery.trim() === '') {
        setRecipes([]);
        return;
      }

      const apiKey = '47239b1c022f44d1b8c885f71fd373ea';
      const baseUrl = 'https://api.spoonacular.com/recipes/complexSearch';
      const params = new URLSearchParams({
        apiKey: apiKey,
        query: searchQuery
      });

      try {
        const response = await fetch(`${baseUrl}?${params.toString()}`);
        const data = await response.json();
        setRecipes(data.results);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [searchQuery]);

  return (
    <div className="recipe-page">
      <button onClick={() => navigate('/welcome')} className="back-button">Back to Welcome</button>
      <h1 className="page-title">Browse Recipes</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="recipes-container">
        {recipes.map(recipe => (
          <div key={recipe.id} className="recipe" onClick={() => navigate(`/recipes/${recipe.id}`)}>
            <h3>{recipe.title}</h3>
            <img src={recipe.image} alt={recipe.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseRecipes;
