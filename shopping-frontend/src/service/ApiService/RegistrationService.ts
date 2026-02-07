import { API_ENDPOINTS, apiUrl } from '../../utils/constants';
import { RegistrationFormData } from '../../types/forms';

// Send verification code to email
export const sendVerificationCode = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl(API_ENDPOINTS.USER_REGISTRATION.SEND_VERIFICATION), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: email,
    });

    if (response.ok) {
      return true;
    }
    return false;
  } catch (err) {
    console.error('Verification code error:', err);
    return false;
  }
};

// Register user
export const userRegister = async (
  formData: Omit<RegistrationFormData, 'confirmPassword'>
): Promise<any> => {
  try {
    const response = await fetch(apiUrl(API_ENDPOINTS.USER_REGISTRATION.REGISTER), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (err) {
    console.error('Register error:', err);
    return null;
  }
};