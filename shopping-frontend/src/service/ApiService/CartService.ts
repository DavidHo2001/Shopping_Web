import { API_ENDPOINTS, apiUrl } from '../../utils/constants';
import { CartItem } from '../../types/forms';

export const fetchCartItems = async (userId: number): Promise<string[]> => {
  try {
    const response = await fetch(apiUrl(`${API_ENDPOINTS.CART.FETCH_ITEMS}/${userId}`), {
      credentials: 'include',
    });

    if (!response.ok) {
      return [];
    }

    const responseText = await response.text();
    let cartData: any;

    if (responseText.startsWith('[') || responseText.startsWith('{')) {
      try {
        const responseData = JSON.parse(responseText);

        if (Array.isArray(responseData)) {
          return [];
        } else if (responseData && responseData.productList) {
          cartData = responseData.productList;
        } else {
          cartData = responseData;
        }
      } catch (parseError) {
        return [];
      }
    } else {
      cartData = responseText;
    }

    if (typeof cartData === 'string' && cartData.length > 0) {
      return cartData.split(',');
    } else if (typeof cartData === 'number') {
      return [cartData.toString()];
    }

    return [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

export const fetchFinalCartItems = async (userId: number): Promise<CartItem[]> => {
  try {
    const response = await fetch(apiUrl(`${API_ENDPOINTS.CART.FETCH_FINAL_ITEMS}/${userId}`), {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }

    return [];
  } catch (error) {
    console.error('Error fetching final cart items:', error);
    return [];
  }
};

export const syncCart = async (userId: number, cartItemsIds: string): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl(`${API_ENDPOINTS.CART.SYNC}/${userId}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ cartItemsIds }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error syncing cart:', error);
    return false;
  }
};

export const clearCart = async (userId: number): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl(`${API_ENDPOINTS.CART.CLEAR}/${userId}`), {
      method: 'DELETE',
      credentials: 'include',
    });

    return response.ok;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};
