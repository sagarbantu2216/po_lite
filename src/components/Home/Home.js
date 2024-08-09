import React, { useState, useEffect, useRef } from "react";
import Loader from "../Loader/Loader";
import "../Loader/Loader.css";
import Modal from "../Modal/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png"; // Adjust the import based on your project structure
import { Ask, BaseURL, GetFileContent, Upload } from "../../Network/Endpoints";
// import { useNavigate } from "react-router-dom";

const sectionNames = [
  "Problem List",
  "Medical History",
  "Medications",
  "Social History",
  "Surgical History",
  "Family History",
  "Vital Signs",
  "Lab Results",
  "Imaging Results",
  "Pathology Reports",
];

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [activeTab, setActiveTab] = useState("chat"); // Active tab state
  const [summarizationResponse, setSummarizationResponse] = useState(null);
  const [chronologicalResponse, setChronologicalResponse] = useState({});
  const [deduplicationResponse, setDeduplicationResponse] = useState(null);
  const [nlpResponse, setnlpResponse] = useState(null);
  const messagesEndRef = useRef(null);
  const [fileContent, setFileContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [uploadedFiles, setLocalUploadedFiles] = useState([]);
  const [doc, setdoc] = useState();

  // const navigate = useNavigate();

  const predefinedQuestions = [
    { key: "deduplication", label: "Deduplication" },
    { key: "summarization", label: "Summarization" },
  ];
  // { key: "nlp", label: "NLP" },
  // { key: "chronological_order", label: "Chronological Order" },

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    // Prepare form data to send with the files
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    formData.append("userId", "1234");
    formData.append("uploadId", "5678");

    try {
      setLoading(true); // Start loading
      const response = await fetch(`${Upload}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log("Files uploaded successfully:", data);

      // Update the state with the uploaded files
      setLocalUploadedFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(files),
      ]);

      // Show success toast notification
      toast.success("File uploaded successfully!", {
        className: "toastify",
      });

      // Handle success or update UI accordingly
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error uploading files:", error.message);
      // Handle error or show error message to user
      toast.error("Error uploading files!", {
        className: "toastify",
      });
      setLoading(false); // Stop loading
    }
  };

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "query", text: inputValue, source: "user" },
      ]);
      fetchResponse(inputValue, "user");
      setInputValue("");
    }
  };

  const fetchResponse = async (question, source) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${Ask}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question }), // Wrap question in an object with key 'query'
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      const answer = data.response.answer; // Use 'answer' from the response JSON

      // Process and format the response
      const formattedMessage = await formatResponse(answer);

      // Resolve the formattedMessage if it's a promise
      const resolvedMessage = await Promise.resolve(formattedMessage);

      // Add the formatted message to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "answer", text: resolvedMessage, source },
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
        const response = await fetch(`${BaseURL}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch response");
        }
  
        const data = await response.json();
        // const data = { result: "Based on the patient's medical records, I will extract relevant information from the \"Social History\" section.\n\n**Problem List**\n\n* **Advance Care Planning**\n\t+ **Advance Directive**: None\n\t+ **Status**: Not completed\n\t+ **Date**: Unknown\n\t+ **Associated Symptoms**: None\n\t+ **Dosage**: N/A\n\t+ **Frequency**: N/A\n\t+ **Route of Administration**: N/A\n\t+ **Duration of Use**: N/A\n\t+ **Relevant Details**: The patient does not have an advance directive in place.\n* **Chronic Conditions**\n\t+ **Age-related Macular Degeneration**: Yes (patient is blind or has difficulty seeing)\n\t\t- **Onset**: Unknown\n\t\t- **Diagnosis Date**: Over 5 years ago\n\t\t- **Status**: Stable\n\t\t- **Associated Symptoms**: Vision difficulties, mostly when driving\n\t\t- **Dosage**: Prescription glasses\n\t\t- **Frequency**: N/A\n\t\t- **Route of Administration**: N/A\n\t\t- **Duration of Use**: Ongoing\n\t\t- **Relevant Details**: The patient uses prescription glasses to correct their vision.\n* **Other Conditions**\n\t+ **Caffeine Consumption**: Moderate\n\t\t- **Onset**: Unknown\n\t\t- **Diagnosis Date**: Unknown\n\t\t- **Status**: Stable\n\t\t- **Associated Symptoms**: None\n\t\t- **Dosage**: N/A\n\t\t- **Frequency**: N/A\n\t\t- **Route of Administration**: N/A\n\t\t- **Duration of Use**: Ongoing\n\t\t- **Relevant Details**: The patient consumes moderate amounts of caffeine.\n\n**Section Offset**: 100\n\n**Sentence**: This section contains the patient's problem list, which includes advance care planning and chronic conditions.\n\n**Extended Sentence**: The patient does not have an advance directive in place and has age-related macular degeneration. They also consume moderate amounts of caffeine.\n\nHere is the extracted information in JSON format:\n```json\n{\n  \"header\": \"Problem List\",\n  \"originalText\": \"\",\n  \"age\": \"unknown\",\n  \"dob\": \"unknown\",\n  \"gender\": \"unknown\",\n  \"race\": \"unknown\",\n  \"ethnicity\": \"unknown\",\n  \"smokingStatus\": \"unknown\",\n  \"result\": [\n    {\n      \"name\": \"Advance Care Planning\",\n      \"sectionOid\": \"SIMPLE_SEGMENT\",\n      \"sectionName\": \"\",\n      \"sectionOffset\": 100,\n      \"sentence\": 0,\n      \"extendedSentence\": 10,\n      \"text\": \"\",\n      \"attributes\": {\n        \"derivedGeneric\": \"1\",\n        \"polarity\": \"positive\",\n        \"relTime\": \"current status\",\n        \"date\": \"unknown\",\n        \"status\": \"not completed\",\n        \"medDosage\": N/A,\n        \"medForm\": N/A,\n        \"medFrequencyNumber\": N/A,\n        \"medFrequencyUnit\": N/A,\n        \"medRoute\": N/A,\n        \"medDurationOfUse\": N/A\n      }\n    },\n    {\n      \"name\": \"Age-related Macular Degeneration\",\n      \"sectionOid\": \"SIMPLE_SEGMENT\",\n      \"sectionName\": \"\",\n      \"sectionOffset\": 100,\n      \"sentence\": 0,\n      \"extendedSentence\": 10,\n      \"text\": \"\",\n      \"attributes\": {\n        \"derivedGeneric\": \"1\",\n        \"polarity\": \"positive\",\n        \"relTime\": \"current status\",\n        \"date\": \"over 5 years ago\",\n        \"status\": \"stable\",\n        \"dosage\": \"prescription glasses\",\n        \"frequency\": N/A,\n        \"routeOfAdministration\": N/A,\n        \"durationOfUse\": \"ongoing\"\n      }\n    },\n    {\n      \"name\": \"Caffeine Consumption\",\n      \"sectionOid\": \"SIMPLE_SEGMENT\",\n      \"sectionName\": \"\",\n      \"sectionOffset\": 100,\n      \"sentence\": 0,\n      \"extendedSentence\": 10,\n      \"text\": \"\",\n      \"attributes\": {\n        \"derivedGeneric\": \"1\",\n        \"polarity\": \"positive\",\n        \"relTime\": \"current status\",\n        \"date\": \"unknown\",\n        \"status\": \"stable\",\n        \"dosage\": N/A,\n        \"frequency\": N/A,\n        \"routeOfAdministration\": N/A,\n        \"durationOfUse\": \"ongoing\"\n      }\n    }\n  ]\n}\n```\nNote: The UMLS concept codes are not provided in this response as they were not requested. However, if you would like me to include them, I can do so using the URL you provided (https://uts-ws.nlm.nih.gov)." };
  
        const answer = data.result || data.deduplicated_text;
        const formattedMessage = await formatResponse(answer);
        setter(formattedMessage);
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching response:", error);
        setLoading(false); // Stop loading
      }
    } else if (endpoint === "chronological_order") {
      for (const sectionName of sectionNames) {
        await fetchSectionData(sectionName);
      }
      setLoading(false); // Stop loading
    } else if (endpoint === "nlp") {
      try {
        const response = await fetch(`${BaseURL}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: "none" }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch response");
        }
  
        const data = await response.json();
  
        const nplres = await formatResponse(data.response);
        setnlpResponse(nplres);
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching response:", error);
        setLoading(false); // Stop loading
      }
    }
  };
  
  const fetchSectionData = async (sectionName) => {
    try {
      const response = await fetch(`${BaseURL}/chronological_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section_name: sectionName }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }
  
      const data = await response.json();
  
      const renderResponses = (result) => {
        const processValue = (value, keyIndex = 0) => {
          if (typeof value === "object" && value !== null) {
            return Object.entries(value).map(([key, subValue], subIndex) => (
              <div key={`${keyIndex}-${subIndex}`} style={{ marginBottom: "5px" }}>
                <strong>{key}:</strong> {processValue(subValue, `${keyIndex}-${subIndex}`)}
              </div>
            ));
          }
          return <span>{value}</span>;
        };
  
        const resultContent = processValue(result);
  
        return (
          <div className="response-line">
            <strong>Response</strong>
            <div>{resultContent}</div>
            {result.source_document && (
              <a
                href="#"
                className="link-button"
                onClick={(e) => {
                  e.preventDefault();
                  handleDocumentClick(result.source_document);
                }}
                style={{
                  marginTop: "10px",
                  display: "block",
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                View Source Document
              </a>
            )}
          </div>
        );
      };
  
      const renderedResponses = renderResponses(data.result);
  
      setChronologicalResponse((prevResponses) => ({
        ...prevResponses,
        [sectionName]: renderedResponses,
      }));
    } catch (error) {
      console.error(`Error fetching data for section ${sectionName}:`, error);
    }
  };
  

  const handleDocumentClick = async (source) => {
    console.log("Document clicked:", source);
    const filename = source.split("/").pop();
    try {
      const filedata = await fetch(`${GetFileContent}${filename}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!filedata.ok) {
        throw new Error("Failed to fetch file content");
      }
      const data = await filedata.json();
      setdoc(source);
      const formatttedtext = await formatResponse(data.text);
      setFileContent(formatttedtext);
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
    } 
    // else if (key === "chronological_order") {
    //   fetchPredefinedResponse("chronological_order", setChronologicalResponse);
    // } 
    else if (key === "deduplication") {
      fetchPredefinedResponse("deduplicate", setDeduplicationResponse);
    } 
    // else if (key === "nlp") {
    //   fetchPredefinedResponse("nlp", setnlpResponse);
    // }
  };
  

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatResponse = async (response) => {
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
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800 text-white flex flex-col items-center p-4">
        <img src={logo} alt="logo" className="mb-4" />
        <h2 className="mb-4">AI Assistant</h2>
        <h2 className="mb-4">Please Upload only (pdf and txt)</h2>
        <input
          type="file"
          onChange={handleFileUpload}
          multiple
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer mb-4"
        >
          Upload Files
        </label>
        <div className="flex flex-col space-y-2 overflow-y-auto">
          {uploadedFiles.length > 0 && (
            <>
              <h3 className="mb-2">Uploaded Files:</h3>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="bg-gray-700 p-2 rounded">
                  {file.name}
                </div>
              ))}
            </>
          )}
        </div>
        {/* <button
          className="mt-auto bg-red-500 text-white py-2 px-4 rounded"
          // onClick={() => {
          //   doSignOut().then(() => {
          //     navigate("/");
          //   });
          // }}
        >
          Logout
        </button> */}
      </div>
      <div className="w-3/4 flex flex-col">
        <div className="bg-gray-200 p-4 flex justify-between">
          <div className="flex space-x-4">
            <button
              className={`tab ${
                activeTab === "chat" ? "bg-blue-500 text-white" : "bg-gray-300"
              } py-2 px-4 rounded`}
              onClick={() => handleTabClick("chat")}
              disabled={uploadedFiles.length === 0}
            >
              Chat with Documents
            </button>
            {predefinedQuestions.map(({ key, label }) => (
              <button
                key={key}
                className={`tab ${
                  activeTab === key ? "bg-blue-500 text-white" : "bg-gray-300"
                } py-2 px-4 rounded`}
                onClick={() => handleTabClick(key)}
                disabled={uploadedFiles.length === 0}
              >
                {label}
              </button>
            ))}
          </div>
          <ToastContainer toastClassName="toastify" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {loading && <Loader />} {/* Show loader when loading */}
          {activeTab === "chat" && (
            <div className="flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="chat-lines">
                  {message.type === "query" && message.source === "user" && (
                    <div className="bg-blue-100 p-2 rounded">
                      {message.text}
                    </div>
                  )}
                  {message.type === "answer" && (
                    <div className="bg-green-100 p-2 rounded">
                      {message.text}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          {activeTab === "summarization" && summarizationResponse}
          {/* {activeTab === "chronological_order" &&
            Object.entries(chronologicalResponse).map(([section, response]) => (
              <div key={section}>
                <h3 className="text-center font-bold">{section}</h3>
                {response}
              </div>
            ))} */}
          {activeTab === "deduplication" && deduplicationResponse}
          {/* {activeTab === "nlp" && nlpResponse} */}
        </div>
        {showModal && (
          <Modal content={fileContent} onClose={closeModal} filename={doc} />
        )}
        {activeTab === "chat" && (
          <div className="p-4 bg-gray-200">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 p-2 rounded border border-gray-300"
                placeholder="Type your question here. Press Enter to send."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
              >
                <span>&#9654;</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
