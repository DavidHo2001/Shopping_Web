// Registration Form Interface
export interface RegistrationFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
}

// Profile Form Interface
export interface ProfileFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  birth_date: string;
  sex: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

// Admin Product Form Interface
export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
}

// Cart Payment Form Interface
export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
  cardType: string;
}

// Product Interface
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image: string;
}

// Cart Item Interface
export interface CartItem extends Product {
  quantity: number;
}

// User Interface
export interface User {
  userId: number;
  username: string;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  role?: number;
}
