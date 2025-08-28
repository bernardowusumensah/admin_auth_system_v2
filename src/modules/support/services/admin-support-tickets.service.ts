import { apiClient, ApiUtils } from '@core/config/api.config';
import type {
  SupportTicketDto,
  SupportTicketsResponse,
  SupportTicketSearchParams,
  UpdateTicketStatusRequest,
  AddInternalNoteRequest,
  AssignTicketRequest,
  ApiSuccessResponse
} from '@core/types';

export class AdminSupportTicketsService {
  // Get paginated support tickets with search and filters
  static async getSupportTickets(params: SupportTicketSearchParams = {}): Promise<SupportTicketsResponse> {
    try {
      const {
        search,
        status,
        category,
        assignedTo,
        fromDate,
        toDate,
        page = 1,
        pageSize = 20
      } = params;

      // Build query parameters
      const queryParams: Record<string, unknown> = {
        page,
        pageSize,
      };

      if (search) queryParams.search = search;
      if (status) queryParams.status = status;
      if (category) queryParams.category = category;
      if (assignedTo) queryParams.assignedTo = assignedTo;
      if (fromDate) queryParams.fromDate = fromDate;
      if (toDate) queryParams.toDate = toDate;

      const queryString = ApiUtils.buildQueryParams(queryParams);
      const response = await apiClient.get(`/admin/support/tickets?${queryString}`);
      console.log({
        items: response.data.tickets,
        page: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.totalCount
      });
      
      return {
        items: response.data.tickets,
        page: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.totalCount
      } as SupportTicketsResponse
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Get support ticket by ID
  static async getSupportTicketById(ticketId: string): Promise<SupportTicketDto> {
    try {
      const response = await apiClient.get(`/admin/support/tickets/${ticketId}`);
      return ApiUtils.handleResponse(response);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Update support ticket status
  static async updateTicketStatus(
    ticketId: string, 
    request: UpdateTicketStatusRequest
  ): Promise<ApiSuccessResponse> {
    try {
      const response = await apiClient.put(`/admin/support/tickets/${ticketId}/status`, request);
      return ApiUtils.handleResponse(response);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Add internal note to support ticket
  static async addInternalNote(
    ticketId: string, 
    request: AddInternalNoteRequest
  ): Promise<ApiSuccessResponse> {
    try {
      const response = await apiClient.post(`/admin/support/tickets/${ticketId}/notes`, request);
      return ApiUtils.handleResponse(response);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Assign or unassign support ticket
  static async assignTicket(
    ticketId: string, 
    request: AssignTicketRequest
  ): Promise<ApiSuccessResponse> {
    try {
      const response = await apiClient.put(`/admin/support/tickets/${ticketId}/assign`, request);
      return ApiUtils.handleResponse(response);
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }

  // Export support tickets (optional - for future use)
  static async exportSupportTickets(params: SupportTicketSearchParams = {}): Promise<Blob> {
    try {
      const queryParams: Record<string, unknown> = {};
      
      if (params.search) queryParams.search = params.search;
      if (params.status) queryParams.status = params.status;
      if (params.category) queryParams.category = params.category;
      if (params.assignedTo) queryParams.assignedTo = params.assignedTo;
      if (params.fromDate) queryParams.fromDate = params.fromDate;
      if (params.toDate) queryParams.toDate = params.toDate;
      if (params.page) queryParams.page = params.page;
      if (params.pageSize) queryParams.pageSize = params.pageSize;

      const queryString = ApiUtils.buildQueryParams(queryParams);
      const response = await apiClient.get(`/admin/support/tickets/export?${queryString}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      ApiUtils.handleError(error);
      throw error;
    }
  }
}
