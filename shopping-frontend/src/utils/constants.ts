// Application constants

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  USER_REGISTRATION: {
    REGISTER: '/api/userRegistration',
    SEND_VERIFICATION: '/api/userRegistration/send-verification-code',
  },
  PROFILE: {
    FETCH: '/api/profile/fetchProfile',
    UPDATE: '/api/profile/update',
  },
  PRODUCT: {
    FETCH_ALL: '/api/product/fetchAllProducts',
    FETCH_BY_CATEGORY: '/api/product/fetchByCategory',
  },
  CART: {
    FETCH_ITEMS: '/api/cart/fetchCartItems',
    FETCH_FINAL_ITEMS: '/api/cart/fetchFinalCartItems',
    SYNC: '/api/cart/syncCart',
    CLEAR: '/api/cart/clearCart',
  },
  ADMIN: {
    ADD_PRODUCT: '/api/admin/add-product',
    EDIT_PRODUCT: '/api/admin/edit-product',
    DELETE_PRODUCT: '/api/admin/delete-product',
  },
  SUPERADMIN: {
    USER_ROLE_LIST: '/api/superadmin/user-role/list',
    UPDATE_USER_ROLE: '/api/superadmin/user-role/update',
  },
};

export const IMAGE_BASE_URL = 'https://shopping-web-bucket.s3.ap-southeast-2.amazonaws.com';

export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MIN_LENGTH_PROFILE: 8,
  PHONE_MAX_LENGTH: 20,
  EMAIL_MAX_LENGTH: 100,
  VERIFICATION_CODE_LENGTH: 4,
  MAX_FILE_SIZE_MB: 5,
};

export const CARD_TYPES = ['VISA', 'MASTERCARD', 'AMEX'] as const;

export const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

export const PRODUCT_CATEGORIES = {
  ALL: '',
  MEN: 'Men',
  WOMEN: 'Women',
  ACCESSORIES: 'Accessories',
} as const;
