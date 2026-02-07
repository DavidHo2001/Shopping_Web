import { API_ENDPOINTS, apiUrl } from '../../utils/constants';
import { ProfileFormData } from '../../types/forms';

export const fetchUserProfile = async () => {
  try {
    const response = await fetch(apiUrl(API_ENDPOINTS.PROFILE.FETCH), {
      method: 'GET',
      credentials: 'include',
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch user profile');
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: Partial<ProfileFormData>): Promise<any> => {
  try {
    const response = await fetch(apiUrl(API_ENDPOINTS.PROFILE.UPDATE), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to update profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};