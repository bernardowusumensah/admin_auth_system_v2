import axios from 'axios';

// Define the base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Define interfaces for dashboard data
export interface DashboardStats {
  totalUsers: number;
  systemHealth: number;
  securityScore: string;
  performance: number;
  userGrowth: number;
  uptime: number;
  lastAudit: string;
  responseTime: number;
}

export interface RecentActivity {
  id: string;
  type: 'login' | 'signup' | 'update' | 'delete';
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

// Create axios instance with auth token
const createApiClient = () => {
  const token = localStorage.getItem('authToken');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Fetches dashboard statistics
 * @returns A promise that resolves to dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch dashboard stats:', error);
    // Return mock data for development
    return {
      totalUsers: 1024,
      systemHealth: 98.5,
      securityScore: 'A+',
      performance: 94.2,
      userGrowth: 12,
      uptime: 99.9,
      lastAudit: '2024-01-15',
      responseTime: 150,
    };
  }
}

/**
 * Fetches recent activity
 * @returns A promise that resolves to recent activity list
 */
export async function getRecentActivity(): Promise<RecentActivity[]> {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get<RecentActivity[]>('/dashboard/activity');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch recent activity:', error);
    // Return mock data for development
    return [
      {
        id: '1',
        type: 'login',
        description: 'User logged in successfully',
        timestamp: '2024-01-15T10:30:00Z',
        userId: 'user1',
        userName: 'John Doe',
      },
      {
        id: '2',
        type: 'signup',
        description: 'New user registered',
        timestamp: '2024-01-15T09:15:00Z',
        userId: 'user2',
        userName: 'Jane Smith',
      },
    ];
  }
}

/**
 * Fetches quick actions
 * @returns A promise that resolves to quick actions list
 */
export async function getQuickActions(): Promise<QuickAction[]> {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get<QuickAction[]>('/dashboard/quick-actions');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch quick actions:', error);
    // Return mock data for development
    return [
      {
        id: '1',
        title: 'Add User',
        description: 'Create a new user account',
        icon: 'person_add',
        action: 'add_user',
        color: 'primary',
      },
      {
        id: '2',
        title: 'System Health',
        description: 'Check system status',
        icon: 'health_and_safety',
        action: 'check_health',
        color: 'success',
      },
      {
        id: '3',
        title: 'Security Audit',
        description: 'Run security scan',
        icon: 'security',
        action: 'security_audit',
        color: 'warning',
      },
    ];
  }
}

/**
 * Executes a quick action
 * @param actionId The ID of the action to execute
 * @returns A promise that resolves when the action is completed
 */
export async function executeQuickAction(actionId: string): Promise<void> {
  try {
    const apiClient = createApiClient();
    await apiClient.post(`/dashboard/quick-actions/${actionId}/execute`);
  } catch (error: any) {
    console.error('Failed to execute quick action:', error);
    throw new Error('Failed to execute action');
  }
}
