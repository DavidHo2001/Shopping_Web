import React, { createContext, useContext, useState, useEffect } from 'react';

//Create the Context for user info
const UserContext = createContext();

// Export a custom hook for other components to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Create UserProvider component for App.js
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setDataLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData); //Username, Email, Phone only, from authentication.getPrincipal() (loginController.java)
      } else {
        setUser(null);
      }
    } catch (err) {
      setError('Failed to fetch user data');
      setUser(null);
    } finally {
      setDataLoading(false);
    }
  };

  // Function to update user data
  const updateUser = (newUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newUserData
    }));
  };

  const logout = () => {
    setUser(null);
  };

  // Fetch user on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    dataLoading,
    error,
    fetchUser,
    updateUser,
    logout,
    isLoggedIn: !!user
  };

  //return the Provider with the value
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};