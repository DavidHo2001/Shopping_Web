import { API_ENDPOINTS, apiUrl } from '../../utils/constants';

interface LoginData {
  email: string;
  password: string;
  keepLoggedIn: boolean;
}

interface LoginResponse {
  username: string;
  message?: string;
}

export const login = async (loginData: LoginData): Promise<LoginResponse | null> => {
  try {
    const response = await fetch(apiUrl(API_ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl(API_ENDPOINTS.AUTH.LOGOUT), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    });

    return response.ok;
  } catch (err) {
    console.error('Logout error:', err);
    return false;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await fetch(apiUrl(API_ENDPOINTS.AUTH.ME), {
      credentials: 'include',
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (err) {
    console.error('Fetch user error:', err);
    return null;
  }
};
