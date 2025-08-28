import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { store } from '@app/store';
import { clearAuth } from '@app/authSlice';

// Base API configuration for .NET backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api';

// Create axios instance with .NET API specific configurations
const createApiInstance = (baseURL: string = API_BASE_URL): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      // Get token from Redux store instead of localStorage directly
      const state = store.getState();
      const token = state.auth.token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized - clear auth state and Redux will handle redirect
        store.dispatch(clearAuth());
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export configured instances
export const apiClient = createApiInstance();

// Utility functions for API calls
export const ApiUtils = {
  // Handle .NET API response format
  handleResponse: <T>(response: AxiosResponse<T>) => response.data,
  
  // Handle .NET API errors
  handleError: (error: unknown) => {
    console.error('API Error:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || 
                     error.response.data?.title || 
                     error.response.statusText || 
                     'An error occurred';
      throw new Error(message);
    } else if (axios.isAxiosError(error) && error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  },

  // Build query parameters for .NET API
  buildQueryParams: (params: Record<string, unknown>): string => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return searchParams.toString();
  }
};

export default apiClient;
