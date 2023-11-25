// src/SelectAndRateRecipes.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectAndRateRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState(new Set());
  const [ratings, setRatings] = useState({});
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      const apiKey = '47239b1c022f44d1b8c885f71fd373ea';
      const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=20`);
      const data = await response.json();
      setRecipes(data.recipes);
    };

    fetchRandomRecipes();
  }, []);

  const renderStars = (id) => {
    const currentRating = ratings[id] || 0;
    return [1, 2, 3, 4, 5].map((star) => (
      <span 
        key={star} 
        className={`star ${star <= currentRating ? 'selected' : ''}`}
        onClick={() => {handleRate(id, star); console.log(ratings);}}
      >
        ★
      </span>
    ));
  };

  const canProceedToNextStep = () => {
    if (step === 1) {
      return selectedRecipes.size >= 5;
    }
    if (step === 2) {
      return Array.from(selectedRecipes).every((id) => ratings[id]);
    }
    return false;
  };

  const handleSelectRecipe = (id) => {
    const newSelection = new Set(selectedRecipes);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRecipes(newSelection);
  };

  const handleRate = (id, rating) => {
    setRatings({ ...ratings, [id]: rating });
  };

  const goToNextStep = async () => {
    if (step === 1 && selectedRecipes.size >= 5) {
      setStep(2);
    } else if (step === 2) {
      // Extract userName from localStorage
      const userName = localStorage.getItem('userName');
  
      // Flatten ratings to an array of objects
      const flattenedRatings = Object.entries(ratings).map(([recipeId, rating]) => ({
        userName,
        recipe_id: parseInt(recipeId, 10),
        rating,
      }));
      console.log(flattenedRatings);
      // Send flattened ratings to the backend
      try {
        const response = await fetch('http://localhost:8000/storeRatings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(flattenedRatings),
        });
  
        if (response.ok) {
          console.log('Ratings stored successfully');
          navigate('/welcome');
        } else {
          console.error('Failed to store ratings');
        }
      } catch (error) {
        console.error('Error storing ratings:', error);
      }
    }
  };
  

  return (
    <div className="select-recipes-container">
      {step === 1 && (
        <>
          <h1>Select at least 5 recipes</h1>
          <div>
            {recipes.map(recipe => (
              <div 
                key={recipe.id} 
                className={`recipe-bubble ${selectedRecipes.has(recipe.id) ? 'selected' : ''}`}
                onClick={() => handleSelectRecipe(recipe.id)}
              >
                {recipe.title}
              </div>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <div className="rating-section">
          <h2>Rate the selected recipes</h2>
          {Array.from(selectedRecipes).map(id => (
            <div key={id} className="rating">
              <span>{recipes.find(recipe => recipe.id === id).title}: </span>
              {renderStars(id)}
            </div>
          ))}
        </div>
      )}

      <button 
        className="next-button"
        onClick={goToNextStep}
        disabled={!canProceedToNextStep()}
      >
        Next
      </button>
    </div>
  );
};

export default SelectAndRateRecipes;
