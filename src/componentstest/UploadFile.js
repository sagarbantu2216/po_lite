import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UploadFile.css";
import Loader from "./Loader";
import "./Loader.css";

function UploadFile({ setUploadedFiles }) {
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setLocalUploadedFiles] = useState([]);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    // Prepare form data to send with the files
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true); // Start loading
      const response = await fetch("https://fc8d-18-237-180-150.ngrok-free.app/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log("Files uploaded successfully:", data);

      // Update the state with the uploaded files
      setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
      setLocalUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);

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

  return (
    <div className="file-main">
      {loading && <Loader />} {/* Show loader when loading */}
      <input
        type="file"
        onChange={handleFileUpload}
        multiple
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload" className="upload-button">
        Upload Files
      </label>
      <div className="uploaded-files">
        {uploadedFiles.length > 0 && (
          <ul>
            <h3>Uploaded Files:</h3>
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
      <ToastContainer toastClassName="toastify" />
    </div>
  );
}

export default UploadFile;
