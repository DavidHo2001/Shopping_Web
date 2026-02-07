import React from 'react';

// Generic form change handler
export const createFormChangeHandler = <T extends Record<string, any>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setError?: React.Dispatch<React.SetStateAction<string>>
) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const inputElement = e.target as HTMLInputElement;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? inputElement.checked : value,
    }));
    
    // Clear error when user starts typing
    if (setError) {
      setError('');
    }
  };
};

// Create non-empty payload from form data
export const createNonEmptyPayload = <T extends Record<string, any>>(
  formData: T,
  excludeKeys: string[] = []
): Partial<T> => {
  const payload: Partial<T> = {} as Partial<T>;
  
  Object.keys(formData).forEach((key) => {
    if (!excludeKeys.includes(key) && formData[key] && String(formData[key]).trim() !== '') {
      payload[key as keyof T] = formData[key];
    }
  });
  
  return payload;
};

// Format date for input
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

// Handle API response
export const handleApiResponse = async <T>(
  response: Response,
  onSuccess?: (data: T) => void,
  onError?: (message: string) => void
): Promise<T | null> => {
  if (response.ok) {
    try {
      const data = await response.json();
      if (onSuccess) onSuccess(data);
      return data;
    } catch (e) {
      // If response is not JSON, try text
      const text = await response.text();
      return text as any;
    }
  } else {
    try {
      const errorData = await response.json();
      if (onError) onError(errorData.message || 'Operation failed');
    } catch (e) {
      if (onError) onError('Operation failed');
    }
    return null;
  }
};

// Navigate and reload
export const navigateAndReload = (path: string) => {
  window.location.href = path;
};
