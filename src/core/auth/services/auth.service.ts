import axios from 'axios';

// Define the base URL for API requests
const API_BASE_URL = 'http://localhost:5001/api'; // Adjust this to your actual API base URL

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

/**
 * Authenticates a user with email and password
 * @param credentials The user's login credentials
 * @returns A promise that resolves to the authentication response
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/login`,
      credentials
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error('Login failed. Please check your credentials and try again.');
  }
}

/**
 * Registers a new user
 * @param userData The user's signup data
 * @returns A promise that resolves to the authentication response
 */
export async function signup(userData: SignupData): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/signup`,
      userData
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error('Signup failed. Please check your information and try again.');
  }
}

/**
 * Logs out the current user
 * @returns A promise that resolves when logout is complete
 */
export async function logout(): Promise<void> {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`);
  } catch (error: unknown) {
    // Even if the server request fails, we can still clear local state
    console.warn('Logout request failed, but clearing local state anyway', error);
  }
}
