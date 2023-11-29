import requests
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector
import numpy as np
from pydantic import BaseModel
from typing import List
import httpx

API_KEY = '47239b1c022f44d1b8c885f71fd373ea'

db_config = {
    "host": "sql5.freesqldatabase.com",
    "user": "sql5664841",
    "password": "lAPVsamawY",
    "database": "sql5664841",
    "port": 3306,
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UsernameCheck(BaseModel):
    username: str

class UsernameAdd(BaseModel):
    username: str

class Rating(BaseModel):
    userName: str
    recipe_id: int
    rating: int


# API endpoint to check if the username exists
@app.post("/checkUsername")
async def check_username(data: UsernameCheck):
    try:
        # Create a connection to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Query the database to check if the username exists
        query = "SELECT * FROM Users WHERE Username = %s"
        cursor.execute(query, (data.username,))
        result = cursor.fetchall()

        if result:
            # Username already exists
            return {"exists": True}
        else:
            # Username does not exist
            return {"exists": False}

    except Exception as e:
        
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    finally:
        # Close the database connection
        cursor.close()
        connection.close()

@app.post("/addUsername")
async def add_username(data: UsernameAdd):
    try:
        # Create a connection to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Insert the new username into the database
        query = "INSERT INTO Users (Username) VALUES (%s)"
        cursor.execute(query, (data.username,))
        connection.commit()

        return {"message": "Username added successfully"}

    except Exception as e:
        
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    finally:
        # Close the database connection
        cursor.close()
        connection.close()

@app.post("/storeRatings")
async def store_ratings(ratings: List[Rating]):
    try:
        # Create a connection to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Insert ratings into the database
        for rating in ratings:
            query = "INSERT INTO Ratings (UserID, RecipeID, Rating) VALUES ((SELECT UserID FROM Users WHERE Username = %s), %s, %s)"
            params = (rating.userName, rating.recipe_id, rating.rating)

            # Execute the query
            cursor.execute(query, params)

        # Commit the changes
        connection.commit()

        return {"message": "Ratings stored successfully"}

    except Exception as e:
        
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    finally:
        # Close the database connection
        cursor.close()
        connection.close()

@app.get("/recipeRating/{recipe_id}")   
def get_recipe_rating(recipe_id: int):
    try:
        # Create a connection to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Query the database to get the rating of a specific recipe
        query = "SELECT Rating FROM Ratings WHERE RecipeID = %s"
        cursor.execute(query, (recipe_id,))
        rating = cursor.fetchone()

        return rating['Rating'] if rating else None

    except Exception as e:
        # Handle exceptions (e.g., database connection error)
        # You might want to log the error or handle it in an appropriate way for your application
        print(f"Error: {e}")
        return None

    finally:
        # Close the database connection
        cursor.close()
        connection.close()

@app.get("/userRatings/{username}")
async def get_user_ratings(username: str):
    try:
        # Create a connection to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Query the database to get user ratings
        query = "SELECT RecipeID, Rating FROM Ratings WHERE UserID = (SELECT UserID FROM Users WHERE Username = %s)"
        cursor.execute(query, (username,))
        user_ratings = cursor.fetchall()

        return user_ratings

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    finally:
        # Close the database connection
        cursor.close()
        connection.close()
        
ATTRIBUTES_CONSIDERED = ['vegetarian', 'vegan', 'veryHealthy', 'dairyFree', 'dairyFree'] + ['healthScore', 'pricePerServing']

def get_recipe_details(id: str):
    url = f"https://api.spoonacular.com/recipes/{id}/information"
    params = {"apiKey": API_KEY}
    response = requests.get(url, params=params)
    return response.json() if response.status_code == 200 else None

def extract_ingredients(recipes):
    all_ingredients = set()

    for recipe in recipes:
        for ingredient in recipe.get('extendedIngredients', []):
            all_ingredients.add(ingredient['name'])

    return list(all_ingredients)

def normalize_features(recipe):
    # Normalize binary features to 0 or 1
    binary_features = ['vegetarian', 'vegan', 'veryHealthy', 'dairyFree', 'dairyFree']
    for feature in binary_features:
        recipe[feature] = 1 if recipe[feature] else 0

    # Normalize other features based on your data range
    # Add more features as needed
    recipe['healthScore'] /= 100  # Example normalization for healthScore

    return recipe

def get_random_recipes(number_of_recipes: int):
    url = f"https://api.spoonacular.com/recipes/random"
    params = {
        "apiKey": API_KEY,
        "number": number_of_recipes
    }
    response = requests.get(url, params=params)
    return response.json()['recipes'] if response.status_code == 200 else None

def calculate_similarity_score(target_vector, recipe_vector):
    # Calculate the squared differences between feature values
    differences = [(a - b) ** 2 for a, b in zip(target_vector, recipe_vector)]
    
    # Sum up the squared differences
    similarity_score = sum(differences)
    
    return similarity_score

def calculate_weights(similarity_score, epsilon=1e-5):
    # Invert the similarity score and add a small epsilon to avoid division by zero
    return 1 / (similarity_score + epsilon)

def create_feature_vector(recipe, all_ingredients):
    HIGH_WEIGHT = 1.0
    MED_WEIGHT = 0.8
    LOW_WEIGHT = 0.3

    recipe = normalize_features(recipe)

    vector = []

    high_importance_attributes = ['vegetarian', 'vegan', 'veryHealthy', 'dairyFree', 'dairyFree']
    for attribute in high_importance_attributes:
        vector.append((1 if recipe.get(attribute, False) else 0) * HIGH_WEIGHT)

    ingredients_in_recipe = [ingredient['name'] for ingredient in recipe.get('extendedIngredients', [])]
    for ingredient in all_ingredients:
        vector.append((1 if ingredient in ingredients_in_recipe else 0) * MED_WEIGHT)

    low_importance_features = ['healthScore', 'pricePerServing']
    for feature in low_importance_features:
        value = recipe.get(feature, 0)
        normalized_value = value / 100
        vector.append(normalized_value * LOW_WEIGHT)

    return vector

@app.get("/fetch_random_recipes/{number_of_recipes}")
def fetch_random_recipes(number_of_recipes: int):
    url = f"https://api.spoonacular.com/recipes/random"
    params = {
        "apiKey": API_KEY,
        "number": number_of_recipes
    }
    response = requests.get(url, params=params)
    return response.json()['recipes'] if response.status_code == 200 else None

@app.get("/fetch_recipe_details/{id}")
async def fetch_recipe_details(id: str):
    return get_recipe_details(id)

@app.get("/get_similar_recipes/{id}")
async def get_similar_recipes(id: str):
    target_recipe_details = get_recipe_details(id)
    comparing_recipes_details = get_random_recipes(100)
    all_ingredients = extract_ingredients(comparing_recipes_details + [target_recipe_details])

    target_vector = create_feature_vector(target_recipe_details, all_ingredients)
    similarities = []

    for recipe in comparing_recipes_details:
        recipe_vector = create_feature_vector(recipe, all_ingredients)
        similarity = cosine_similarity([target_vector, recipe_vector])[0][1]
        similarities.append((recipe, similarity))

    top_similar_recipes = sorted(similarities, key=lambda x: x[1], reverse=True)[:10]
    return [recipe for recipe,_ in top_similar_recipes]

@app.get("/recommendRecipes/{username}")
async def recommend_recipes_for_user_with_history(username: str):
    try:
        # Get user ratings from the database
        user_ratings = await get_user_ratings(username)

        if not user_ratings:
            raise HTTPException(status_code=404, detail="User has no ratings")

        # Extract recipe IDs and ratings from user ratings
        recipe_ids = [rating['RecipeID'] for rating in user_ratings]
        user_ratings_values = [rating['Rating'] for rating in user_ratings]

        # Fetch details of target recipes from Spoonacular API
        target_recipes_details = [get_recipe_details(str(recipe_id)) for recipe_id in recipe_ids]

        # Extract all ingredients from target and comparing recipes
        all_ingredients = extract_ingredients(target_recipes_details)

        # Create feature vectors for target recipes
        target_vectors = [create_feature_vector(recipe, all_ingredients) for recipe in target_recipes_details]

        # Fetch details of comparing recipes from Spoonacular API
        comparing_recipes_details = get_random_recipes(100)

        # Create feature vectors for comparing recipes
        comparing_vectors = [create_feature_vector(recipe, all_ingredients) for recipe in comparing_recipes_details]

        # Calculate cosine similarity between target and comparing vectors
        similarity_matrix = cosine_similarity(target_vectors, comparing_vectors)

        # Transpose the similarity matrix to align dimensions correctly
        similarity_matrix = similarity_matrix.T

        # Calculate weighted average similarity score for each comparing recipe
        weighted_similarity_scores = np.dot(similarity_matrix, user_ratings_values) / np.sum(similarity_matrix, axis=1)

        # Sort comparing recipes based on weighted similarity scores
        sorted_recipes = sorted(zip(comparing_recipes_details, weighted_similarity_scores), key=lambda x: x[1], reverse=True)

        # Extract top 10 recommended recipes
        top_recommendations = [recipe for recipe, _ in sorted_recipes[:10]]


        return {"recommendations": top_recommendations}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
if __name__ == "__main__":  
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

