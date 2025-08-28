import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@core/auth/services/auth.service';

// Define the initial state for the auth slice
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Helper functions for localStorage
const loadAuthFromStorage = (): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> => {
  try {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('authUser');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        user,
        token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const saveAuthToStorage = (user: User, token: string) => {
  try {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save auth to storage:', error);
  }
};

const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  } catch (error) {
    console.error('Failed to clear auth from storage:', error);
  }
};

const initialState: AuthState = {
  ...loadAuthFromStorage(),
  loading: false,
  error: null,
};

// Create the auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Persist to localStorage
      saveAuthToStorage(action.payload.user, action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Clear from localStorage
      clearAuthFromStorage();
    },
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Persist to localStorage
      saveAuthToStorage(action.payload.user, action.payload.token);
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Action to initialize auth state on app startup
    initializeAuth: (state) => {
      const authData = loadAuthFromStorage();
      state.user = authData.user;
      state.token = authData.token;
      state.isAuthenticated = authData.isAuthenticated;
    },
    // Action to clear auth state when token is invalid
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearAuthFromStorage();
    },
  },
});

// Export the action creators
export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  signupStart, 
  signupSuccess, 
  signupFailure,
  initializeAuth,
  clearAuth
} = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
