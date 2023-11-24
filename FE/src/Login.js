import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (name.trim() !== '') {
        try {
            // Check if the username exists
            const response = await fetch('http://localhost:8000/checkUsername', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: name }),
            });

            const result = await response.json();

            if (result.exists) {
                // Username already exists, display an error message
                alert('Username already exists. Please select a new username.');
            } else {
                // Username does not exist, add the user to the database
                // You can add code here to send the username to the server and store it in the database
                const addUserResponse = await fetch('http://localhost:8000/addUsername', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: name }),
                });

                const addUserResult = await addUserResponse.json();

                // Log the server response (you can handle it as needed)
                console.log(addUserResult);

                // For now, just store the username in localStorage
                localStorage.setItem('userName', name);

                // Navigate to the appropriate page
                navigate('/select-and-rate-recipes');
            }
        } catch (error) {
            console.error('Error checking username:', error);
            alert('An error occurred while checking the username. Please try again.');
        }
    }
};


  const isNameEmpty = name.trim() === '';

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !isNameEmpty) {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="floating-background">
        <div className="floating-element utensil">🍴</div>
        <div className="floating-element laptop">💻</div>
        <div className="floating-element chef-hat">👩‍🍳</div>
        <div className="floating-element cookie">🍪</div>
        <div className="floating-element pizza">🍕</div>
        <div className="floating-element burger">🍔</div>
        <div className="floating-element salad">🥗</div>
        <div className="floating-element tablet">📱</div>
        <div className="floating-element cake">🍰</div>
        <div className="floating-element coffee">☕</div>
        <div className="floating-element sushi">🍣</div>
        <div className="floating-element cupcake">🧁</div>
      </div>
      <div className="login-box">
        <h1>Welcome to Byte Bites</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleLogin} disabled={isNameEmpty}>Login</button>
      </div>
    </div>
  );
};

export default Login;
