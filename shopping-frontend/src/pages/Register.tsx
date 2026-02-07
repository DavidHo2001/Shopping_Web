import React, { useState, FormEvent, ChangeEvent } from 'react';
import './Register.css';
import { sendVerificationCode, userRegister } from '../service/ApiService/RegistrationService';
import { RegistrationFormData } from '../types/forms';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePasswordMatch,
  validateUsername,
} from '../utils/validation';
import { VALIDATION_RULES } from '../utils/constants';
import { navigateAndReload } from '../utils/formHelpers';

const Register= () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError('');

    // Reset email verification if email changes
    if (name === 'email') {
      setVerificationSent(false);
    }
  };

  const handleRequestVerificationCode = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSendingCode(true);
    setError('');

    const success = await sendVerificationCode(formData.email);

    if (success) {
      setVerificationSent(true);
      alert('Verification code sent to your email!');
    } else {
      setError('Failed to send verification code');
    }
    setSendingCode(false);
  };

  const validateForm = (): boolean => {
    if (!formData.verificationCode) {
      setError('Please enter the verification code sent to your email');
      return false;
    }
    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
      setError('Passwords do not match');
      return false;
    }
    if (!validatePassword(formData.password, VALIDATION_RULES.PASSWORD_MIN_LENGTH)) {
      setError(`Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`);
      return false;
    }
    if (!validateUsername(formData.username, VALIDATION_RULES.USERNAME_MIN_LENGTH)) {
      setError(`Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters long`);
      return false;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      setError('Please enter a valid phone number');
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
      const { confirmPassword, ...submitData } = formData;
      const response = await userRegister(submitData);

      if (response && response.username) {
        alert(`Username: ${response.username} Registration successful! Please login to continue.`);
        navigateAndReload('/login');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please check your connection.');
      console.error('Registration error:', err);
    }
    setLoading(false);
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
              minLength={VALIDATION_RULES.USERNAME_MIN_LENGTH}
              maxLength={VALIDATION_RULES.USERNAME_MAX_LENGTH}
            />
            <small className="form-hint">
              Username must be at least {VALIDATION_RULES.USERNAME_MIN_LENGTH} characters and unique
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
                maxLength={VALIDATION_RULES.USERNAME_MAX_LENGTH}
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
                maxLength={VALIDATION_RULES.USERNAME_MAX_LENGTH}
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
                maxLength={VALIDATION_RULES.EMAIL_MAX_LENGTH}
              />
              <button
                type="button"
                onClick={handleRequestVerificationCode}
                disabled={sendingCode || !formData.email}
                className="btn btn--secondary verification-btn"
              >
                {sendingCode ? 'Sending...' : 'Get Code'}
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
                maxLength={VALIDATION_RULES.VERIFICATION_CODE_LENGTH}
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
              maxLength={VALIDATION_RULES.PHONE_MAX_LENGTH}
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
              minLength={VALIDATION_RULES.PASSWORD_MIN_LENGTH}
            />
            <small className="form-hint">
              Password must be at least {VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters
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
              <span className="checkmark"></span>I agree to the{' '}
              <a href="/terms" className="auth-link">
                Terms of Service
              </a>{' '}
              and{' '}
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
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
