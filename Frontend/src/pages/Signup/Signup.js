import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./index.css"; 

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required!";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Enter a valid email!";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters!";
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (validateForm()) {
      try {
        const response = await axios.post("https://headlinehubbackend.onrender.com/api/auth/sign-up", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        console.log("✅ Sign-up successful:", response.data);
        setSubmitted(true);

        // Redirect to login after a delay
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        console.error("❌ Signup error:", error.response?.data || error.message);
        setServerError(error.response?.data?.error || "Signup failed. Try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Create an Account</h2>

        {submitted ? (
          <div className="success-message">
            🎉 Sign-Up Successful! Redirecting to Login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="signup-form">
            {serverError && <p className="error-text">{serverError}</p>}

            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`input-field ${errors.name ? "input-error" : ""}`}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`input-field ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`input-field ${errors.password ? "input-error" : ""}`}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`input-field ${errors.confirmPassword ? "input-error" : ""}`}
              />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
