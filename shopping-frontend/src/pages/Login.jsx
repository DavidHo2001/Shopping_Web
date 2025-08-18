import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    keepLoggedIn: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    // Update form data Dictionary
    //{e.target.name: e.target.value,
    // e.target.name: e.target.value,
    // e.target.name: e.target.value...}
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    //When the keep login is checked, the default value is "on"  
    if(formData.keepLoggedIn){
      formData.keepLoggedIn = true;
    }
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert("[Login successful] Welcome back, " + data.username + "!");
        window.location.reload();
        
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login to Glasy</h1>
          <p>Welcome back! Please sign in to your account.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox"
                checked={formData.keepLoggedIn}
                name="keepLoggedIn"
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Keep me logged in
            </label>
            <a href="/forgot-password" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="auth-link">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
