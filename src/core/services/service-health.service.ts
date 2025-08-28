import { apiClient, ApiUtils } from '@core/config/api.config';
import type { ServiceHealthResponse, ServiceHealthDto } from '@core/types';
import { ServiceStatus } from '@core/types';

export class ServiceHealthService {
  // Get health status of all monitored services
  static async getServicesHealth(): Promise<ServiceHealthResponse> {
    try {

      const response = await apiClient.get('/admin/health/services');
      return ApiUtils.handleResponse(response);
    } catch (error: unknown) {
      console.log(error);
      console.warn('Failed to fetch real service health, falling back to mock data');
      return await this.getMockServicesHealth();
    }
  }

  // Get health status of a specific service
  static async getServiceHealth(serviceName: string): Promise<ServiceHealthDto> {
    try {
      const response = await apiClient.get(`/admin/health/services/${encodeURIComponent(serviceName)}`);
      return ApiUtils.handleResponse(response);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Mock function for testing - remove when real API is ready
  static async getMockServicesHealth(): Promise<ServiceHealthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockServices: ServiceHealthDto[] = [
      {
        service: 'UserIdentity Service',
        statusCode: 200,
        status: ServiceStatus.Healthy,
        lastChecked: new Date().toISOString(),
        responseTime: 45
      },
      {
        service: 'Player Service',
        statusCode: 401,
        status: ServiceStatus.Unavailable,
        lastChecked: new Date().toISOString(),
        responseTime: 1200
      },
      {
        service: 'GameSettings Service',
        statusCode: 200,
        status: ServiceStatus.Healthy,
        lastChecked: new Date().toISOString(),
        responseTime: 78
      },
      {
        service: 'Orders Service',
        statusCode: 200,
        status: ServiceStatus.Healthy,
        lastChecked: new Date().toISOString(),
        responseTime: 156
      }
    ];

    return {
      services: mockServices,
      lastUpdated: new Date().toISOString()
    };
  }
}
