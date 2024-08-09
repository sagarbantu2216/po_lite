import React from "react";
import "./Modal.css"; // Ensure to style the modal appropriately

const Modal = ({ content, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose}>X</button>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Modal;
