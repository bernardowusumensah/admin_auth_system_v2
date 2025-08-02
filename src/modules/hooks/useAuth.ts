import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { login as loginService, signup as signupService, logout as logoutService } from '@core/auth/services/auth.service';
import { loginStart, loginSuccess, loginFailure, signupStart, signupSuccess, signupFailure, logout } from '@app/authSlice';
import type { LoginCredentials, SignupData } from '@core/auth/services/auth.service';
import type { AppDispatch, RootState } from '@app/store';

// Custom hook for authentication logic
export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch(loginStart());
    try {
      const response = await loginService(credentials);
      dispatch(loginSuccess({ user: response.user, token: response.token }));
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  const signup = useCallback(async (userData: SignupData) => {
    dispatch(signupStart());
    try {
      const response = await signupService(userData);
      dispatch(signupSuccess({ user: response.user, token: response.token }));
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch(signupFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  const logoutUser = useCallback(async () => {
    try {
      await logoutService();
      dispatch(logout());
    } catch (error: unknown) {
      // Even if logout fails, we should clear local state
      console.warn('Logout failed, but clearing local state anyway', error);
      dispatch(logout());
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout: logoutUser,
  };
};
