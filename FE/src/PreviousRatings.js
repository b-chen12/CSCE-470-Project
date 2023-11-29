// src/UserRatingsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRatingsPage = () => {
  const [userRatings, setUserRatings] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user ratings based on the username from localStorage
    const fetchUserRatings = async () => {
      const userName = localStorage.getItem('userName');

      try {
        const response = await fetch(`http://localhost:8000/userRatings/${userName}`);
        if (response.ok) {
          const data = await response.json();
          setUserRatings(data);
          // Fetch details for each recipe ID
          data.forEach((rating) => fetchRecipeDetails(rating.RecipeID));
        } else {
          console.error('Failed to fetch user ratings');
        }
      } catch (error) {
        console.error('Error fetching user ratings:', error);
      }
    };

    const fetchRecipeDetails = async (recipeID) => {
      try {
        const response = await fetch(`http://localhost:8000/fetch_recipe_details/${recipeID}`);
        if (response.ok) {
          const data = await response.json();
          setRecipeDetails((prevDetails) => ({ ...prevDetails, [recipeID]: data.title }));
        } else {
          console.error(`Failed to fetch details for recipe ID ${recipeID}`);
        }
      } catch (error) {
        console.error(`Error fetching details for recipe ID ${recipeID}:`, error);
      }
    };

    fetchUserRatings();
  }, []);

  return (
    <div className="user-ratings-page">
      <button onClick={() => navigate('/welcome')} className="back-button">
        Back to Welcome
      </button>
      <h1 className="page-title">Previous Ratings</h1>

      {userRatings.length === 0 ? (
        <p>No ratings found for the user.</p>
      ) : (
        <div className="recipes-container">
          {userRatings.map((rating) => (
            <div
              key={rating.RecipeID}
              className="recipe"
              onClick={() => navigate(`/recipes/${rating.RecipeID}`)}
            >
              <h3>{recipeDetails[rating.RecipeID]}</h3>
              <p>Rating: {rating.Rating}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRatingsPage;
