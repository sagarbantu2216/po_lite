import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Form.css';
import logo from '../assets/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Username:', username);
    console.log('Password:', password);

    fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password,
        expiresInMins: 60, // optional, defaults to 60
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      return res.json();
    })
    .then(data => {
      console.log('API Response:', data);
      navigate('/home'); // Use navigate function for redirection
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Login failed. Please check your credentials and try again.');
    });
  };

  return (
    <div className="form">
    <div className="form-container">
      <img src={logo} alt="Logo" className="form-logo" />
      <h2 className='formh2'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className='formlable'>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className='frominput'
          />
        </div>
        <div className="form-group">
          <label className='formlable'>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className='frominput'
          />
        </div>
        <button type="submit" className='formbtn'>Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p className='loginp'>
        <Link to="/signup" className='logina'>Sign Up</Link> | <Link to="/forgot-password" className='logina'>Forgot Password?</Link>
      </p>
    </div>
    </div>
  );
};

export default Login;
