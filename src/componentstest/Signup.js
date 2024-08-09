import React from 'react';
import { Link } from 'react-router-dom';
import './Form.css'; // Import CSS file for styling
import logo from '../assets/logo.png'; // Import logo image

const Signup = () => {
  return (
    <div className="form">
    <div className="form-container">
      <img src={logo} alt="Logo" className="form-logo" />
      <h2 className='formh2'>Sign Up</h2>
      <form>
        <div className="form-group">
          <label className='formlable'>Email:</label>
          <input type="email" required className='frominput' />
        </div>
        <div className="form-group">
          <label className='formlable'>Password:</label>
          <input type="password" required className='frominput' />
        </div>
        <div className="form-group">
          <label className='formlable'>Confirm Password:</label>
          <input type="password" required  className='frominput'/>
        </div>
        <button type="submit" className='formbtn'>Sign Up</button>
      </form>
      <p className='loginp'>
        <Link to="/" className='logina'>Login</Link>
      </p>
    </div>
    </div>
  );
};

export default Signup;
