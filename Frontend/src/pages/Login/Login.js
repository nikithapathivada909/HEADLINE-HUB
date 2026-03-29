import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./index.css";

const Login = () => {
  const { setUser } = useContext(AuthContext); // Get user context
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://headlinehubbackend.onrender.com/api/auth/login",
        { email, password }
      );
      const { token, role ,userId} = response.data;

      // Store token & role
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId); 

      // Set user in context
      setUser({ role, token });

      // Redirect based on role
      // if (role === "admin") {
      //   navigate("/admin");
      // } else if (role === "special_person") {
      //   navigate("/special-person");
      // } else {
      //   navigate("/user");
      // }
      navigate('/');
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="signup-text">
        Don't have an account? <Link to="/sign-up">Sign up here</Link>
      </p>

      <div className="special-credentials-box">
  <p><strong>🔐 Special Login Credentials:</strong></p>
  <ul>
    <li>Email: <code>rahulspecial@gmail.com</code></li>
    <li>Password: <code>rahul@123</code></li>
  </ul>
   <p><strong>🔐 Admin Login Credentials:</strong></p>
  <ul>
    <li>Email: <code>alice@example.com</code></li>
    <li>Password: <code>rahul@123</code></li>
  </ul>
</div>

    </div>
  );
};

export default Login;
