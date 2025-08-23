import { apiClient, ApiUtils } from '@core/config/api.config';
import type {
  UserDto,
  AccountsResponse,
  AccountDetailsResponse,
  AccountSearchParams,
  CreateSubscriptionRequest,
  CancelSubscriptionRequest
} from '@core/types';
import { MockDataGenerator } from '@core/utils/mock-data';

export class AccountsService {
  // Get paginated accounts with search and filters
  static async getAccounts(params: AccountSearchParams = {}): Promise<AccountsResponse> {
    try {
      const {
        page = 1,
        pageSize = 10,
        searchTerm,
        filters,
        sortBy = 'createdOn',
        sortOrder = 'desc'
      } = params;

      // Use mock data for development/testing
      if (import.meta.env.VITE_ENV === 'development') {
        console.log('🔄 Using mock data for accounts');
        await new Promise(resolve => setTimeout(resolve, 500));
        return MockDataGenerator.getMockAccountsResponse(page, pageSize);
      }

      // Build query parameters for .NET API
      const queryParams: Record<string, any> = {
        page,
        pageSize,
        sortBy,
        sortOrder,
      };

      if (searchTerm) {
        queryParams.searchTerm = searchTerm;
      }

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams[key] = value;
          }
        });
      }

      const queryString = ApiUtils.buildQueryParams(queryParams);
      const response = await apiClient.get(`/admin/accounts?${queryString}`);
      
      return ApiUtils.handleResponse(response);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Get detailed account information
  static async getAccountDetails(accountId: string): Promise<AccountDetailsResponse> {
    try {
      // Use mock data for development
      if (import.meta.env.VITE_ENV === 'development') {
        console.log('🔄 Using mock data for account details');
        await new Promise(resolve => setTimeout(resolve, 300));
        return MockDataGenerator.getMockAccountDetails(accountId);
      }

      const response = await apiClient.get(`/admin/accounts/${accountId}`);
      return ApiUtils.handleResponse(response);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Get user details for an account
  static async getUserDetails(userId: string): Promise<UserDto> {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return ApiUtils.handleResponse(response);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Ban account - Maps to your .NET endpoint: POST /api/admin/accounts/{id}/ban
  static async banAccount(accountId: string): Promise<void> {
    try {
      await apiClient.post(`/admin/accounts/${accountId}/ban`);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Unban account - Maps to your .NET endpoint: DELETE /api/admin/accounts/{id}/ban
  static async unbanAccount(accountId: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/accounts/${accountId}/ban`);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Force disconnect player - Maps to your .NET endpoint: POST /api/admin/accounts/{id}/disconnect
  static async disconnectPlayer(accountId: string): Promise<void> {
    try {
      await apiClient.post(`/admin/accounts/${accountId}/disconnect`);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Create subscription - Uses your CreateSubscriptionRequest
  static async createSubscription(request: CreateSubscriptionRequest): Promise<void> {
    try {
      await apiClient.post('/admin/subscriptions', request);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Cancel subscription - Uses your CancelSubscriptionRequest
  static async cancelSubscription(request: CancelSubscriptionRequest): Promise<void> {
    try {
      await apiClient.post('/admin/subscriptions/cancel', request);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Export accounts (for future use)
  static async exportAccounts(params: AccountSearchParams = {}): Promise<Blob> {
    try {
      const queryString = ApiUtils.buildQueryParams(params);
      const response = await apiClient.get(`/admin/accounts/export?${queryString}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }
}
