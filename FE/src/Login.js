// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name.trim() !== '') {
      localStorage.setItem('userName', name);
      navigate('/welcome');
    }
  };

  // Check if name is empty to disable/enable the login button
  const isNameEmpty = name.trim() === '';

  // Function to handle Enter key press
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
