import React, { useState, useEffect, useRef } from "react";
import "./ChatArea.css";
import Tabs from "./Tabs";
import Loader from "./Loader"; // Assume you have a Loader component
import "./Loader.css"; // Your custom styles for the transcript
import Modal from "./Modal"; // Modal component for displaying file content

function ChatArea({ addQuestionTab, uploadedFiles }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [activeTab, setActiveTab] = useState("chat"); // Active tab state
  const [summarizationResponse, setSummarizationResponse] = useState(null);
  const [chronologicalResponse, setChronologicalResponse] = useState(null);
  const [deduplicationResponse, setDeduplicationResponse] = useState(null);
  const messagesEndRef = useRef(null);
  const [fileContent, setFileContent] = useState("");
  const [showModal, setShowModal] = useState(false);

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "query", text: inputValue, source: "user" },
      ]);
      fetchResponse(inputValue, "user");
      addQuestionTab(inputValue);
      setInputValue("");
    }
  };

  const fetchResponse = async (question, source) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("https://fc8d-18-237-180-150.ngrok-free.app/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: question }), // Wrap question in an object with key 'query'
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      const answer = data.result; // Use 'answer' from the response JSON
      console.log("Answer:", answer);

      // Process and format the response
      const formattedMessage = formatResponse(answer);

      // Add the formatted message to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "answer", text: formattedMessage, source },
      ]);
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false); // Stop loading
    }
  };

  const fetchPredefinedResponse = async (endpoint, setter) => {
    setLoading(true); // Start loading
    if (endpoint === "summarize" || endpoint === "deduplicate") {
      try {
        const response = await fetch(`https://fc8d-18-237-180-150.ngrok-free.app/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch response");
        }
  
        const data = await response.json();
  
        const answer = data.result || data.deduplicated_text;
        const formattedMessage = formatResponse(answer);
        setter(formattedMessage);
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching response:", error);
        setLoading(false); // Stop loading
      }
    } else if (endpoint === "chronological_order") {
      try {
        const response = await fetch(`https://fc8d-18-237-180-150.ngrok-free.app/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch response");
        }

        const data = await response.json();
        console.log("Answer:", data);

          const renderResponses = () => {
          return Object.values(data).map((item, index) => {
            const { answer, sourcefile } = item;
            if (!answer) return null; // Skip items without an answer
  
            const points = answer.split("\n").map((line, lineIndex) => {
              const pointNumber = `${index + 1}.${lineIndex + 1}`;
              return sourcefile ? (
                <button
                  key={`${index}-${lineIndex}`}
                  className="link-button"
                  onClick={() => handleDocumentClick(sourcefile)}
                >
                  {pointNumber} {line}
                </button>
              ) : (
                <span key={`${index}-${lineIndex}`}>
                  {pointNumber} {line}
                </span>
              );
            });
  
            return <div key={index} className="response-line">{points}</div>;
          });
        };
  
        setChronologicalResponse(renderResponses);
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching response:", error);
        setLoading(false); // Stop loading
      }
    }
  };
  

  const handleDocumentClick = async (source) => {
    console.log("Document clicked:", source);
    const filename = source.split("/").pop();
    try {
      const filedata = await fetch(`https://fc8d-18-237-180-150.ngrok-free.app/get-file-content?filename=${filename}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!filedata.ok) {
        throw new Error("Failed to fetch file content");
      }
      const data = await filedata.json();
      console.log("File content:", data);
      setFileContent(data.text);
      console.log("File content:", fileContent);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    if (key === "summarization") {
      fetchPredefinedResponse("summarize", setSummarizationResponse);
    } else if (key === "chronological_order") {
      fetchPredefinedResponse("chronological_order", setChronologicalResponse);
    } else if (key === "deduplication") {
      fetchPredefinedResponse("deduplicate", setDeduplicationResponse);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatResponse = (response) => {
    // Split the response into lines
    const lines = response.split("\n");
    const formattedLines = lines.map((line, index) => {
      return <p key={index}>{line.trim()}</p>;
    });

    return <div className="response">{formattedLines}</div>;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-area">
      {loading && <Loader />} {/* Show loader when loading */}
      <Tabs
        activeTab={activeTab}
        onTabClick={handleTabClick}
        tabs={[
          { key: "chat", label: "Chat with Documents" },
          { key: "summarization", label: "Summarization" },
          { key: "chronological_order", label: "Chronological Order" },
          { key: "deduplication", label: "Deduplication" },
        ]}
        disableButtons={uploadedFiles.length === 0} // Disable buttons if no files are uploaded
      />
      <div className="chat-messages">
        {activeTab === "chat" &&
          messages.map((message, index) => (
            <div key={index} className="chat-lines">
              {message.type === "query" && message.source === "user" && (
                <div className="chat-message question">{message.text}</div>
              )}
              {message.type === "answer" && (
                <div className="chat-message answer">{message.text}</div>
              )}
            </div>
          ))}
        {activeTab === "summarization" && summarizationResponse}
        {activeTab === "chronological_order" && chronologicalResponse}
        {activeTab === "deduplication" && deduplicationResponse}
        <div ref={messagesEndRef} />
      </div>
      {showModal && <Modal content={fileContent} onClose={closeModal} />}
      {activeTab === "chat" && (
        <div className="chatinputplacer">
          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question here. Press Enter to send."
            />
            <button onClick={sendMessage} className="send-button">
              <span>&#9654;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatArea;
