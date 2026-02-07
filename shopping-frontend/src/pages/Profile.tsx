import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import './Login.css';
import { useUser } from '../contexts/UserContext';
import { fetchUserProfile, updateUserProfile } from '../service/ApiService/ProfileService';
import { ProfileFormData } from '../types/forms';
import {
  validateUsername,
  validatePassword,
  validatePasswordMatch,
} from '../utils/validation';
import { VALIDATION_RULES, GENDER_OPTIONS } from '../utils/constants';
import { createNonEmptyPayload, formatDateForInput, navigateAndReload } from '../utils/formHelpers';

const Profile= () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    birth_date: '',
    sex: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, dataLoading } = useUser();

  useEffect(() => {
    if (!dataLoading && user) {
      setFormData((prevData) => ({
        ...prevData,
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      }));
    }
  }, [user, dataLoading]);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await fetchUserProfile();
      if (userData) {
        setFormData((prevData) => ({
          ...prevData,
          birth_date: userData.birth_date ? formatDateForInput(userData.birth_date) : '',
          sex: userData.sex || '',
          address: userData.address || '',
          city: userData.city || '',
          zip: userData.zip || '',
          country: userData.country || '',
        }));
      } else {
        setError('Failed to load profile data');
      }
    } catch (err) {
      setError('Network error while loading profile');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!validateUsername(formData.username, VALIDATION_RULES.USERNAME_MIN_LENGTH)) {
      setError(`Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters long`);
      return false;
    }

    if (formData.oldPassword && !formData.password && !formData.confirmPassword) {
      setError('If you want to change your password, you need to fill in the new password and confirm password');
      return false;
    }

    if (
      formData.oldPassword &&
      formData.password &&
      (!validatePasswordMatch(formData.password, formData.confirmPassword) ||
        !validatePassword(formData.password, VALIDATION_RULES.PASSWORD_MIN_LENGTH_PROFILE))
    ) {
      setError(
        `Password and confirm password do not match or is less than ${VALIDATION_RULES.PASSWORD_MIN_LENGTH_PROFILE} characters long`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Create payload with only non-empty fields (email is always included)
      const payload = createNonEmptyPayload(formData, ['confirmPassword']);
      payload.email = formData.email; // Email is always included

      const data = await updateUserProfile(payload);
      if (data) {
        alert(`[Profile updated]: ${data.message || 'Profile updated successfully'}`);
        navigateAndReload('/login');
      } else {
        setError('Profile update failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please check your connection.');
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
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
            <label htmlFor="password">New Password</label>
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
            {loading ? 'Updating Profile...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
