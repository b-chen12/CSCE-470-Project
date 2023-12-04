# CSCE-470-Project

# Backend Setup

To run the back end of this project, follow these steps:

1. Change the current directory to the "BE" (Back End) folder:
   ```bash
   cd BE
2. Install dependencies
    ```bash
    pip install fastapi uvicorn
    pip install requests
3. Start the backend
    ```bash
    python3 api.py

This will launch the backend server, located at http://127.0.0.1:8000. So if you want to call the "hello" endpoint, you would call it via http://127.0.0.1:8000/hello


# Frontend Setup

To run the front end of this project, follow these steps:

Make sure you have node.js installed: https://nodejs.org/en/download

1. Change the current directory to the "FE" (Front End) folder:
   ```bash
   cd FE
2. Install dependencies
    ```bash
    npm install
3. Start the frontend
    ```bash
    npm start

This will launch the development server, and your front end application will be accessible in your web browser at a specified URL, typically http://localhost:3000.

# Database Setup

Prereqs:
- Download MySQL: https://dev.mysql.com/downloads/installer/
- Download DataGrip (better user interface) OR Download MySQL WorkBench: 
   - DataGrip
        - Apply for the student developer license: https://www.jetbrains.com/shop/eform/students
        - Installation Guide: https://www.jetbrains.com/help/datagrip/installation-guide.html

Database information: 

Host: sql5.freesqldatabase.com
Database name: sql5664841
Database user: sql5664841
Database password: lAPVsamawY
Port number: 3306

Reference the end of this YouTube Video on how to use these credentials to connect to the DB:
https://www.youtube.com/watch?v=TMGHOW8Hzvw&t=324s

# API Keys

Here's the API keys that we use from Spoontacular API:

8dc2b3c170dd45889b7e2342480e04f8
 
8db4685761404112bf99d59d3bc2719e
 
dc88b536a15648f9bb205c69a1a3dc54
 
25d4bd6186d946a4ab0b00a0e6db6797
 
6f2226c45e2b44ac9aeb5dc0aabc5eac
 
68ce7924ec4b4909bf782daf2be82cc0
 
e002927cb2974115beed9afba7523c53
 
290852aeb71d4b37adbed983a15b47f5

Note:
- If you run into this error - "Undefined map" that signals you've run out of API calls, and you will need to use a new API key.
- If you run into this error - "UnboundLocalError: local variable 'cursor' referenced before assignment" in the backend, the database free trial has expired, and the code will be unable to run one week after 12/4/23.

