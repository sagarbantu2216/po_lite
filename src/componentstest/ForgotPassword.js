import React from 'react';
import { Link } from 'react-router-dom';
import './Form.css'; // Import CSS file for styling
import logo from '../assets/logo.png'; // Import logo image

const ForgotPassword = () => {
  return (
    <div className="form">
    <div className="form-container">
      <img src={logo} alt="Logo" className="form-logo" />
      <h2 className='formh2'>Forgot Password</h2>
      <form>
        <div className="form-group">
          <label className='formlable'>Email:</label>
          <input type="email" required  className='frominput'/>
        </div>
        <button type="submit" className='formbtn'>Reset Password</button>
      </form>
      <p className='loginp'>
        <Link to="/" className='logina'>Login</Link> | <Link to="/signup" className='logina' >Sign Up</Link>
      </p>
    </div>
    </div>
  );
};

export default ForgotPassword;

