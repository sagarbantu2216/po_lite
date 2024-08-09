import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home/Home";

const Routs = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
  )
};

export default Routs;
// import React, { useState } from 'react';
// import './App.css';
// import Sidebar from './components/Sidebar';
// import ChatArea from './components/ChatArea';

// const Routs = () => {
//   const [questionTabs, setQuestionTabs] = useState([]);
//   const [uploadedFiles, setUploadedFiles] = useState([]);

//   const addQuestionTab = (question) => {
//     if (!questionTabs.includes(question)) {
//       setQuestionTabs([...questionTabs, question]);
//     }
//   };

//   const handleTabClick = (question) => {
//     // Scroll to the referenced question in the chat area (you can implement this logic)
//   };

//   return (
//     <div className="app">
//       <Sidebar setUploadedFiles={setUploadedFiles} questionTabs={questionTabs} onTabClick={handleTabClick} />
//       <ChatArea addQuestionTab={addQuestionTab} uploadedFiles={uploadedFiles} />
//     </div>
//   );
// };

// export default Routs;
