  import React, { useState, useEffect } from "react";
  import "./Login.css";
  import { useUser } from "../contexts/UserContext";

  const Profile = () => {
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      birth_date: "",
      sex: "",
      address: "",
      city: "",
      zip: "",
      country: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { user, dataLoading, logout, isLoggedIn } = useUser();
    useEffect(() => {
      if (!dataLoading) {
        setFormData(prevData => ({
          ...prevData,
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        }));
      }
    }, [user]);
    // Fetch user profile data on component mount
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch("/api/profile/fetchProfile", {
            method: "GET",
            credentials: "include" // Include cookies for authentication
          });
          
          if (response.ok) {
            const userData = await response.json();
            setFormData(prevData => ({
              ...prevData,
              birth_date: userData.birth_date ? userData.birth_date.split('T')[0] : "",
              sex: userData.sex || "",
              address: userData.address || "",
              city: userData.city || "",
              zip: userData.zip || "",
              country: userData.country || "",
            }));
          } else {
            setError("Failed to load profile data");
          }
        } catch (err) {
          setError("Network error while loading profile");
        }
      };

      fetchUserProfile();
    }, []);

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
      
      // Create payload with only non-empty fields (email is always included)
      const payload = { email: formData.email };
      
      //Data validation
      if(formData.username.length < 3){
        setError("Username must be at least 3 characters long");
        setLoading(false);
        return;
      }
      if (formData.oldPassword && !formData.password && !formData.confirmPassword){
        setError("If you want to change your password, you need to fill in the new password and confirm password");
        setLoading(false);
        return;
      }
      if (formData.oldPassword && formData.password && formData.password !== formData.confirmPassword
        && formData.password.length < 8
      ){
        setError("Password and confirm password do not match or is less than 8 characters long");
        setLoading(false);
        return;
      }

      // Add non-empty fields to payload
      Object.keys(formData).forEach(key => {
        if (key !== 'email' && formData[key] && formData[key].trim() !== '') {
          payload[key] = formData[key];
        }
      });
      
      try {
        const response = await fetch("/api/profile/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        
        if (response.ok) {
          const data = await response.json();
          alert("[Profile updated]: " + data.message);
          window.location.href = '/login';
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Profile update failed. Please try again.");
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Update Profile</h1>
            <p>Your profile information.</p>
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
                placeholder="Enter your username"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                readOnly
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="form-input"
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
                placeholder="Enter your last name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="birth_date">Birth Date</label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sex">Gender</label>
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="Enter your ZIP code"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter your country"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="oldPassword">Current Password</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter current password (if changing password)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password (optional)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--full"
              disabled={loading}
            >
              {loading ? "Updating Profile..." : "Update Profile"}
            </button>
          </form>


        </div>
      </div>
    );
  };

  export default Profile;
