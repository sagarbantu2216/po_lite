import React from 'react';
import './Tabs.css';

function Tabs({ onTabClick, activeTab, disableButtons }) {
  const predefinedQuestions = [
    { key: "deduplication", label: "Deduplication" },
    { key: "chronological_order", label: "Chronological Order" },
    { key: "summarization", label: "Summarization" },
  ];

  const handlelogout = () => {
    //redirect to the login page
    window.location.href = '/';
    }


  return (
    <div className="tabs">
      <button
        className={`tab ${activeTab === "chat" ? "active" : ""}`}
        onClick={() => onTabClick("chat")}
        disabled={disableButtons}
      >
        Chat with Documents
      </button>
      {predefinedQuestions.map(({ key, label }) => (
        <button
          className={`tab ${activeTab === key ? "active" : ""}`}
          key={key}
          onClick={() => onTabClick(key)}
          disabled={disableButtons}
        >
          {label}
        </button>
      ))}
      <button className='logout' onClick={handlelogout}>Logout</button> {/* Add a logout button */}
    </div>
  );
}

export default Tabs;
