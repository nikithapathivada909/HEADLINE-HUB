import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const ChangeUsername = ({ isOpen, onClose, currentUsername, onSave }) => {
  const [newUsername, setNewUsername] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const BACKEND_URL = "http://localhost:5000";
  const BACKEND_URL =  "https://headlinehubbackend.onrender.com";

  if (!isOpen) return null;

  const handleSave = async () => {
    setError("");

    if (!newUsername || !confirmUsername) {
      setError("All fields are required!");
      return;
    }

    if (newUsername !== confirmUsername) {
      setError("Usernames do not match!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        return;
      }

      const response = await axios.put(
        `${BACKEND_URL}/api/users/change-username`,
        { newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message); // Success message
      onSave(newUsername); // Update username in the parent component
      onClose(); // Close modal
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update username!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Username</h2>
        {error && <p className="error-message">{error}</p>}

        <label>Current Username</label>
        <input type="text" value={currentUsername} disabled />

        <label>New Username</label>
        <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />

        <label>Confirm New Username</label>
        <input type="text" value={confirmUsername} onChange={(e) => setConfirmUsername(e.target.value)} />

        <div className="modal-actions">
          <button className="button button-green" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button className="button button-red" onClick={onClose} disabled={loading}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUsername;
