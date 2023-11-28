// src/UserRatingsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRatingsPage = () => {
  const [userRatings, setUserRatings] = useState([]);
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
        } else {
          console.error('Failed to fetch user ratings');
        }
      } catch (error) {
        console.error('Error fetching user ratings:', error);
      }
    };

    fetchUserRatings();
  }, []);

  return (
    <div className="user-ratings-page">
      <button onClick={() => navigate('/welcome')} className="back-button">Back to Welcome</button>
      <h1 className="page-title">Previous Ratings</h1>

      {userRatings.length === 0 ? (
        <p>No ratings found for the user.</p>
      ) : (
        <ul>
          {userRatings.map((rating) => (
            <li key={rating.RecipeID}>
              Recipe ID: {rating.RecipeID}, Rating: {rating.Rating}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserRatingsPage;
