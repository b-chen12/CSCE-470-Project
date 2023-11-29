// src/UserRatingsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import './RecipePage.css';

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
        <div className="similar-recipes-section">
          <ul className="similar-recipes-list">
            {userRatings.map((rating) => (
              <li key={rating.RecipeId}>
              <Link to={`/recipes/${rating.RecipeID}`} className="right-aligned-link">
                {recipeDetails[rating.RecipeID]}
                <span className="rating">{' Rating: '}{rating.Rating}</span>
              </Link>
            </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserRatingsPage;