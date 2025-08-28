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

      // Build query parameters for .NET API
      const queryParams: Record<string, unknown> = {
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
      
      return response.data;
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Get detailed account information
  static async getAccountDetails(accountId: string): Promise<AccountDetailsResponse> {
    try {
      const response = await apiClient.get(`/admin/accounts/${accountId}`);

      return {
        account: response.data,
        user: response.data?.user
      };
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
