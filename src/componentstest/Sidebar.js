import React from 'react';
import './Sidebar.css';
import UploadFile from './UploadFile';
import logo from '../assets/logo.png';

function Sidebar({ setUploadedFiles }) {
  return (
    <div className="sidebar">
      <img src={logo} alt="logo" className='logo' />
      <h2>INFERSCIENCE</h2>
      <div className='uploadfilebutton'>
        <UploadFile setUploadedFiles={setUploadedFiles} />
      </div>
      <div className='sidebar-footer'>
        <p>Product Of Edvenswa <img src="https://edvenswatech.com/wp-content/uploads/2023/03/edvenswa-logo.png" alt='logo' width="20px" height="20px" /></p>
      </div>
    </div>
  );
}

export default Sidebar;
