import React, { useState } from "react";
import "./addTask.css"; // Import the CSS file

const TaskPopup = ({ isOpen, onClose, onCreateTask }) => {
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("start");

  if (!isOpen) return null; // Don't render if modal is closed

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return; // Prevent empty tasks

    // Pass task name & category to the parent
    onCreateTask({ name: taskName, category });

    setTaskName(""); // Reset input field
    setCategory("Start"); // Reset category
    onClose(); // Close modal after submitting
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter task name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="input-field"
            required
          />
          {/* Dropdown for Category Selection */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="dropdown"
          >
            <option value="Start">Start</option>
            <option value="Finish">Finish</option>
          </select>

          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="create-button">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskPopup;
