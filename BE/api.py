import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector
from pydantic import BaseModel
from typing import List

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

def get_random_recipes(number_of_recipes: int):
    url = f"https://api.spoonacular.com/recipes/random"
    params = {
        "apiKey": API_KEY,
        "number": number_of_recipes
    }
    response = requests.get(url, params=params)
    return response.json()['recipes'] if response.status_code == 200 else None

def create_feature_vector(recipe, all_ingredients):
    HIGH_WEIGHT = 1.0
    MED_WEIGHT = 0.8
    LOW_WEIGHT = 0.3

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)