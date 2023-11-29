import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const apiKey = '0628066b63b349d686703a51b0da80f2';
      const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    const fetchSimilarRecipes = async () => {
      const url = `http://127.0.0.1:8000/get_similar_recipes/${id}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setSimilarRecipes(data);
        console.log(1+1);
      } catch (error) {
        console.error('Error fetching similar recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
    fetchSimilarRecipes();
  }, [id]);

  if (isLoading) {
    return <div className="loader"></div>;
  }

  if (!recipe) {
    return <div className="error-message">Recipe not found</div>;
  }

  return (
    <div className="recipe-detail-page">
      <h1 className="recipe-title">{recipe.title}</h1>
      <img className="recipe-image" src={recipe.image} alt={recipe.title} />
      <div className="recipe-summary" dangerouslySetInnerHTML={{ __html: recipe.summary }} />

      {recipe.extendedIngredients && (
        <div className="ingredients-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
        </div>
      )}

      {similarRecipes.length > 0 && (
        <div className="similar-recipes-section">
          <h2>Similar Recipes that ByteBites recommends</h2>
          <ul className="similar-recipes-list">
            {similarRecipes.map((similarRecipe) => (
              <li key={similarRecipe.id}>
                <Link to={`/recipes/${similarRecipe.id}`}>{similarRecipe.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
