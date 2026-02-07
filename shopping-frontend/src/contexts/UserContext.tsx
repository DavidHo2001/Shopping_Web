import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/forms';
import { fetchCartItems, syncCart, clearCart as clearCartService } from '../service/ApiService/CartService';
import { fetchCurrentUser } from '../service/ApiService/AuthService';

interface UserContextType {
  user: User | null;
  cart: string[];
  cartLoading: boolean;
  dataLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  fetchCart: () => Promise<void>;
  updateUser: (newUserData: Partial<User>) => void;
  logout: () => void;
  addToCart: (productId: number) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemCount: () => number;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setDataLoading(true);
      setError(null);

      const userData = await fetchCurrentUser();
      setUser(userData);
    } catch (err) {
      setError('Failed to fetch user data');
      setUser(null);
    } finally {
      setDataLoading(false);
    }
  };

  const updateUser = (newUserData: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...newUserData } : null));
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const fetchCart = async () => {
    if (!user || !user.userId) {
      setCart([]);
      return;
    }

    try {
      setCartLoading(true);
      const cartData = await fetchCartItems(user.userId);
      setCart(cartData);
    } catch (error) {
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId: number): Promise<boolean> => {
    if (!user || !user.userId) {
      alert('Please log in to add items to cart');
      return false;
    }

    try {
      // Fetch current cart data from server
      const currentCartData = await fetchCartItems(user.userId);
      const newCartData = [...currentCartData, productId.toString()];
      const cartItemsIdsString = newCartData.join(',');

      const success = await syncCart(user.userId, cartItemsIdsString);

      if (success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const removeFromCart = async (productId: number): Promise<void> => {
    if (!user || !user.userId) return;

    try {
      const currentProductIds = cart.filter((id) => id !== productId.toString());
      const cartItemsIdsString = currentProductIds.join(',');

      const success = await syncCart(user.userId, cartItemsIdsString);

      if (success) {
        await fetchCart();
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!user || !user.userId) return;

    try {
      const success = await clearCartService(user.userId);

      if (success) {
        setCart([]);
        await fetchCart();
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const getCartItemCount = (): number => {
    return cart.length;
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.userId) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const value: UserContextType = {
    user,
    cart,
    cartLoading,
    dataLoading,
    error,
    fetchUser,
    fetchCart,
    updateUser,
    logout,
    addToCart,
    removeFromCart,
    clearCart,
    getCartItemCount,
    isLoggedIn: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
