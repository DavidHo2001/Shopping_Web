import { API_ENDPOINTS, IMAGE_BASE_URL, apiUrl } from '../../utils/constants';
import { Product, ProductFormData } from '../../types/forms';

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(apiUrl(API_ENDPOINTS.PRODUCT.FETCH_ALL));
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch products');
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await fetch(apiUrl(`${API_ENDPOINTS.PRODUCT.FETCH_BY_CATEGORY}/${category}`));
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch products by category');
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const addProduct = async (formData: ProductFormData, imageFile: File | null): Promise<string> => {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('brand', formData.brand);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    const response = await fetch(apiUrl(API_ENDPOINTS.ADMIN.ADD_PRODUCT), {
      method: 'POST',
      body: formDataToSend,
    });

    if (response.ok) {
      return await response.text();
    }
    throw new Error('Failed to add product');
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (
  productId: number,
  formData: ProductFormData,
  imageFile: File | null
): Promise<string> => {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('id', productId.toString());
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('brand', formData.brand);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    const response = await fetch(apiUrl(API_ENDPOINTS.ADMIN.EDIT_PRODUCT), {
      method: 'PUT',
      body: formDataToSend,
    });

    if (response.ok) {
      return await response.text();
    }
    throw new Error('Failed to update product');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: number): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl(`${API_ENDPOINTS.ADMIN.DELETE_PRODUCT}/${productId}`), {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getImageUrl = (imagePath: string): string => {
  return `${IMAGE_BASE_URL}${imagePath}`;
};
