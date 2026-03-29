
import React, { useContext } from "react";
import "./index.css";
import logo from "./main_logo.png";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useContext(AuthContext); // User state from context
  const navigate = useNavigate();

  // Handle Settings button click based on user role
  const handleSettingsClick = () => {
    if (user.role === "admin") {
      navigate("/admin"); // Admin Settings Page
    } else if (user.role === "special_person") {
      navigate("/post-management"); // Special User Settings Page
    } else {
      navigate("/user"); // General User Settings Page
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <ul className="nav-links">
        <li><a href="#latest-news">Latest</a></li>
        <li><a href="#business">Business</a></li>
        <li><a href="#sports">Sports</a></li>
        <li><a href="#technology">Technology</a></li>
        <li><a href="#world">World</a></li>
        <li><a href="#nation">Nation</a></li>
      </ul>

      {/* Conditionally Render Login Button or Settings Button */}
      {user ? (
        <button className="settings-btn" onClick={handleSettingsClick}>
          ⚙️ Settings
        </button>
      ) : (
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
