
import React, { useState, useEffect } from "react";
import axios from "axios";
import ChangePassword from "../../modals/ChangePassword/ChangePassword";
import ChangeUsername from "../../modals/ChangeUsername/ChangeUsername";
import SavedArticles from "../../modals/savedNews/savedNews";
import "./index.css";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const userId = localStorage.getItem("userId"); // Get userId from localStorage// Change to your actual backend URL

  useEffect(() => {
    if (!userId) {
      console.error("User ID not found!");
      return;
    }

    // Fetch user details from backend
    axios
      .get("https://headlinehubbackend.onrender.com/api/users/user-info/${userId}")
      .then((response) => {
        setUsername(response.data.name);
        setEmail(response.data.email);
      })
      .catch((error) => console.error("Error fetching user details:", error));
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1>Headline Hub</h1>
        <ul>
          <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            Profile
          </li>
          <li className={activeTab === "savedNews" ? "active" : ""} onClick={() => setActiveTab("savedNews")}>
            Saved News
          </li>
          <li className="logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === "profile" && (
          <div className="profile-container">
            <h2>Profile</h2>
            <div className="profile-details">
              <span>Username: {username || "Loading..."}</span>
              <button className="button button-blue" onClick={() => setUsernameModalOpen(true)}>
                Change Username
              </button>
            </div>
            <div className="email">
              Email: {email || "Loading..."}
            </div>
            <button className="button button-green" onClick={() => setPasswordModalOpen(true)}>
              Change Password
            </button>
          </div>
        )}

        {activeTab === "savedNews" && <SavedArticles />}
      </main>

      {/* Modals */}
      <ChangeUsername
        isOpen={isUsernameModalOpen}
        onClose={() => setUsernameModalOpen(false)}
        currentUsername={username}
        onSave={(newUsername) => setUsername(newUsername)}
      />
      <ChangePassword
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        currentUsername={username}
        onSave={(newPassword) => console.log("New Password:", newPassword)}
      />
    </div>
  );
};

export default UserDashboard;
