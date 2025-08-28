import { AxiosError } from 'axios';
import { apiClient } from '@core/config/api.config';

// Define the shape of our user data
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Define the shape of our login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Define the shape of our signup data
export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Define the shape of our API response
export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthWithAccountResponse {
  user: LoginAccount;
  token: string;
  message: string;
}

export interface LoginAccount {
  id: string;
  email: string;
  user?: User;
}

/**
 * Authenticates a user with email and password
 * @param credentials The user's login credentials
 * @returns A promise that resolves to the authentication response
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthWithAccountResponse>(
      '/Login',
      credentials
    );

    const data = {
      user: {
        id: response.data.user.id,
        email: response.data.user.email,
        firstName: response.data.user.user ? response.data.user.user.firstName : '',
        lastName: response.data.user.user ? response.data.user.user.lastName : '',
      } as User,
      token: response.data.token
    }

    return data;
  } catch (error: unknown) {
    console.error('Login error:', error);
    const axiosError = error as AxiosError<{ message: string }>;
    const message = axiosError?.response?.data?.message || 'Login failed. Please check your credentials and try again.';
    throw new Error(message);
  }
}

/**
 * Registers a new user
 * @param userData The user's signup data
 * @returns A promise that resolves to the authentication response
 */
export async function signup(userData: SignupData): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/Signup',
      userData
    );
    
    return response.data;
  } catch (error: unknown) {
    console.error('Signup error:', error);
    const axiosError = error as AxiosError<{ message: string }>;
    const message = axiosError?.response?.data?.message || 'Signup failed. Please check your information and try again.';
    throw new Error(message);
  }
}

/**
 * Logs out the current user
 * @returns A promise that resolves when logout is complete
 */
export async function logout(): Promise<void> {
  try {
    // Optional: Call logout endpoint if your API has one
    // await axios.post(`${API_BASE_URL}/auth/logout`);
    console.log('Logout completed');
  } catch (error: unknown) {
    console.warn('Logout request failed', error);
  }
}
