// Support Ticket Management Types

export const TicketStatus = {
  New: 'New',
  Open: 'Open',
  PendingPlayerResponse: 'PendingPlayerResponse',
  Closed: 'Closed'
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export interface PlayerInfo {
  username: string;
  email: string;
}

export interface IssueDetails {
  category: string;
  subject: string;
  details: string;
}

export interface InternalNote {
  id: string;
  note: string;
  author: string;
  timestamp: string; // ISO 8601 format
}

export interface SupportTicketDto {
  ticketId: string;
  status: TicketStatus;
  submittedAt: string; // ISO 8601 format
  lastUpdatedAt: string; // ISO 8601 format
  assignedTo?: string;
  playerInfo: PlayerInfo;
  issueDetails: IssueDetails;
  internalNotes: InternalNote[];
}

export interface SupportTicketsResponse {
  items: SupportTicketDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SupportTicketSearchParams {
  search?: string;
  status?: TicketStatus;
  category?: string;
  assignedTo?: string;
  fromDate?: string; // ISO 8601 format
  toDate?: string; // ISO 8601 format
  page?: number;
  pageSize?: number;
}

// Request/Response types for API operations
export interface UpdateTicketStatusRequest {
  ticketId?: string;
  newStatus: TicketStatus;
}

export interface AddInternalNoteRequest {
  ticketId?: string;
  noteContent: string;
}

export interface AssignTicketRequest {
  assignedTo?: string; // null or empty string unassigns
}

export interface ApiSuccessResponse {
  message: string;
}

export interface ApiErrorResponse {
  error: string;
}
