// Validation utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string, minLength: number = 6): boolean => {
  return password.length >= minLength;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const validateUsername = (username: string, minLength: number = 3): boolean => {
  return username.length >= minLength;
};

export const validateVerificationCode = (code: string): boolean => {
  return /^[0-9]{4}$/.test(code);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};
