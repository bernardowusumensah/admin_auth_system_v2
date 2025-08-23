import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Base API configuration for .NET backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api';
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'authToken';

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
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
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
        // Handle unauthorized - redirect to login
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.location.href = '/login';
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
  handleError: (error: any) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || 
                     error.response.data?.title || 
                     error.response.statusText || 
                     'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  },

  // Build query parameters for .NET API
  buildQueryParams: (params: Record<string, any>): string => {
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
