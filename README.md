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

- Host: sql5.freesqldatabase.com
- Database name: sql5661780
- Database user: sql5661780
- Database password: 7I9aiu1tBZ
- Port number: 3306

Reference the end of this YouTube Video on how to use these credentials to connect to the DB:
https://www.youtube.com/watch?v=TMGHOW8Hzvw&t=324s
