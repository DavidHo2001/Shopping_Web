import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
    
    // Reset email verification if email changes
    if (e.target.name === "email") {
      setEmailVerified(false);
      setVerificationSent(false);
    }
  };

  const sendVerificationCode = async () => {
    if (!formData.email) {
      setError("Please enter your email address first");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setSendingCode(true);
    setError("");

    try {
      const response = await fetch("/api/userRegistration/send-verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationSent(true);
        alert("Verification code sent to your email!");
      } else {
        setError(data.message || "Failed to send verification code");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Verification code error:", err);
    } finally {
      setSendingCode(false);
    }
  };

  const validateForm = () => {
    if (!formData.verificationCode) {
      setError("Please enter the verification code sent to your email");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    // Basic phone validation (optional field)
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;

      //Register user
      const response = await fetch("/api/userRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful registration
        console.log("Registration successful:", data);
        setEmailVerified(true);
        // You can add redirect logic here
        // window.location.href = '/login';
        alert("Registration successful! Please login to continue.");
        window.location.reload();
        
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Glasy and discover your perfect eyewear style.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              className="form-input"
              minLength="3"
              maxLength="50"
            />
            <small className="form-hint">
              Username must be at least 3 characters and unique
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
                className="form-input"
                maxLength="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
                className="form-input"
                maxLength="50"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="email-verification-container">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="form-input"
                maxLength="100"
              />
              <button
                type="button"
                onClick={sendVerificationCode}
                disabled={sendingCode || !formData.email}
                className="btn btn--secondary verification-btn"
              >
                {sendingCode ? "Sending..." : "Get Code"}
              </button>
            </div>
            {verificationSent && (
              <small className="form-hint success-hint">
                Verification code sent! Check your email.
              </small>
            )}
          </div>

          {verificationSent && (
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                required
                placeholder="Enter 4-digit code"
                className="form-input"
                maxLength="4"
                pattern="[0-9]{4}"
              />
              <small className="form-hint">
                Enter the 4-digit code sent to your email (expires in 10 minutes)
              </small>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="form-input"
              maxLength="20"
            />
            <small className="form-hint">
              Include country code if international (e.g., +1 for US)
            </small>
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
              placeholder="Create a password"
              className="form-input"
              minLength="6"
            />
            <small className="form-hint">
              Password must be at least 6 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="form-input"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" required />
              <span className="checkmark"></span>I agree to the{" "}
              <a href="/terms" className="auth-link">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="auth-link">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <a href="/login" className="auth-link">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
