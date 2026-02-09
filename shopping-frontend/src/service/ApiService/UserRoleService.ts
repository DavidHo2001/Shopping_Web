import { API_ENDPOINTS, apiUrl } from '../../utils/constants';

export interface UserRole {
  id: number;
  username: string;
  role: string;
  roleId: number;
  isBlocked: boolean;
}

export interface UserRoleResponse {
  success: boolean;
  message: string;
  data: UserRole[];
}

export interface UpdateUserRoleRequest {
  userId: number;
  roleId: number;
  isBlocked: boolean;
}

export const fetchUserRoleList = async (): Promise<UserRole[]> => {
  try {
    const response = await fetch(apiUrl(API_ENDPOINTS.SUPERADMIN.USER_ROLE_LIST), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result: UserRoleResponse = await response.json();
      return result.data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user roles');
    }
  } catch (err) {
    console.error('Fetch user role list error:', err);
    throw err;
  }
};

export const updateUserRole = async (
  userId: number,
  roleId: number,
  isBlocked: boolean
): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl(API_ENDPOINTS.SUPERADMIN.UPDATE_USER_ROLE), {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, roleId, isBlocked }),
    });

    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user role');
    }
  } catch (err) {
    console.error('Update user role error:', err);
    throw err;
  }
};
