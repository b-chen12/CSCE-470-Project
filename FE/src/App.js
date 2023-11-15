import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Welcome from './Welcome';
import RecommendedRecipes from './RecommendedRecipes';
import RecommendedRecipesByGenre from './RecommendedRecipesByGenre';
import BrowseRecipes from './BrowseRecipes';
import PreviousRatings from './PreviousRatings';
import RecipeDetail from './RecipeDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/recommended-recipes" element={<RecommendedRecipes />} />
        <Route path="/recommended-recipes-by-genre" element={<RecommendedRecipesByGenre />} />
        <Route path="/browse-recipes" element={<BrowseRecipes />} />
        <Route path="/previous-ratings" element={<PreviousRatings />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
