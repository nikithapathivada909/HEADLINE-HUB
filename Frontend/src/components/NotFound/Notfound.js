import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const NotFound = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="notfound-container">
      <img
        className="notfound-img"
        src="https://source.unsplash.com/featured/300x200/?404,error"
        alt="404 Not Found"
      />
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      
      {/* Go back to the previous page */}
      <button className="back-button" onClick={() => navigate(-1)}>
        🔙 Go Back
      </button>
    </div>
  );
};

export default NotFound;
