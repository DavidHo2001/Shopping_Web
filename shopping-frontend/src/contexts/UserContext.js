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

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
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
        setUser(userData); //UserId, Username, Email, Phone only, from authentication.getPrincipal() (loginController.java)
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

  const updateUser = (newUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newUserData
    }));
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
      const response = await fetch(`/api/cart/fetchCartItems/${user.userId}`, {
        credentials: "include"
      });
      
      if (response.ok) {
        const responseText = await response.text();
        
        let cartData;
        if (responseText.startsWith('[') || responseText.startsWith('{')) {
          try {
            const responseData = JSON.parse(responseText);
            
            if (Array.isArray(responseData)) {
              setCart([]);
              return;
            } else if (responseData && responseData.productList) {
              cartData = responseData.productList;
            } else {
              cartData = responseData;
            }
          } catch (parseError) {
            setCart([]);
            return;
          }
        } else {
          cartData = responseText;
        }
        
        if (typeof cartData === 'string' && cartData.length > 0) {
          setCart(cartData.split(','));
        } else if (typeof cartData === 'number') {
          setCart([cartData.toString()]);
        } else {
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } catch (error) {
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!user || !user.userId) {
      alert("Please log in to add items to cart");
      return false;
    }

    try {
      // Fetch current cart data directly from server (not rely on state)
      const response = await fetch(`/api/cart/fetchCartItems/${user.userId}`, {
        credentials: "include"
      });
      
      let currentCartData = [];
      if (response.ok) {
        const responseText = await response.text();
        
        let cartData;
        if (responseText.startsWith('[') || responseText.startsWith('{')) {
          try {
            const responseData = JSON.parse(responseText);
            
            if (Array.isArray(responseData)) {
              cartData = [];
            } else if (responseData && responseData.productList) {
              cartData = responseData.productList;
            } else {
              cartData = responseData;
            }
          } catch (parseError) {
            return false;
          }
        } else {
          cartData = responseText;
        }
        
        if (typeof cartData === 'string' && cartData.length > 0) {
          currentCartData = cartData.split(',');
        } else if (typeof cartData === 'number') {
          currentCartData = [cartData.toString()];
        } else if (Array.isArray(cartData)) {
          currentCartData = cartData;
        }
      }
      
      const newCartData = [...currentCartData, productId.toString()];
      const cartItemsIdsString = newCartData.join(",");
      
      const syncResponse = await fetch(`/api/cart/syncCart/${user.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cartItemsIds: cartItemsIdsString }),
      });
      
      if (syncResponse.ok) {
        await fetchCart();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user || !user.userId) return;

    try {
      const currentProductIds = cart.filter(id => id !== productId.toString());
      const cartItemsIdsString = currentProductIds.join(",");
      
      const response = await fetch(`/api/cart/syncCart/${user.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cartItemsIds: cartItemsIdsString }),
      });
      
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const clearCart = async () => {
    if (!user || !user.userId) return;

    try {
      const response = await fetch(`/api/cart/clearCart/${user.userId}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      if (response.ok) {
        setCart([]);
        await fetchCart();
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const getCartItemCount = () => {
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

  const value = {
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
    isLoggedIn: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};