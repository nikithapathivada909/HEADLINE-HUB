import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const ChangePassword = ({ isOpen, onClose, currentUsername }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState("");

  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const BACKEND_URL ="https://headlinehubbackend.onrender.com";
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserToken(token);
    } else {
      console.warn("⚠️ No token found in localStorage");
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = async () => {
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    console.log("🔑 User Token:", userToken); // Debugging

    try {
      setLoading(true);
      const response = await axios.put(
        `${BACKEND_URL}/api/users/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      alert(response.data.message); // Success message
      onClose(); // Close modal after success
    } catch (err) {
      console.error("❌ API Error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to update password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Password</h2>
        {error && <p className="error-message">{error}</p>}

        <label>Current Username</label>
        <input type="text" value={currentUsername} disabled />

        <label>Current Password</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

        <label>New Password</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

        <label>Confirm New Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

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

export default ChangePassword;

