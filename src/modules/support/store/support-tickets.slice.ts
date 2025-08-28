import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  SupportTicketDto, 
  SupportTicketsResponse, 
  SupportTicketSearchParams,
  UpdateTicketStatusRequest,
  AddInternalNoteRequest,
  AssignTicketRequest
} from '@core/types';
import { AdminSupportTicketsService } from '@modules/support/services/admin-support-tickets.service';

// Async thunks
export const fetchSupportTickets = createAsyncThunk(
  'supportTickets/fetchSupportTickets',
  async (params: SupportTicketSearchParams) => {
    return await AdminSupportTicketsService.getSupportTickets(params);
  }
);

export const fetchSupportTicketById = createAsyncThunk(
  'supportTickets/fetchSupportTicketById',
  async (ticketId: string) => {
    return await AdminSupportTicketsService.getSupportTicketById(ticketId);
  }
);

export const updateTicketStatus = createAsyncThunk(
  'supportTickets/updateTicketStatus',
  async ({ ticketId, request }: { ticketId: string; request: UpdateTicketStatusRequest }) => {
    await AdminSupportTicketsService.updateTicketStatus(ticketId, request);
    return { ticketId, newStatus: request.newStatus };
  }
);

export const addInternalNote = createAsyncThunk(
  'supportTickets/addInternalNote',
  async ({ ticketId, request }: { ticketId: string; request: AddInternalNoteRequest }) => {
    await AdminSupportTicketsService.addInternalNote(ticketId, request);
    return { ticketId, noteContent: request.noteContent };
  }
);

export const assignTicket = createAsyncThunk(
  'supportTickets/assignTicket',
  async ({ ticketId, request }: { ticketId: string; request: AssignTicketRequest }) => {
    await AdminSupportTicketsService.assignTicket(ticketId, request);
    return { ticketId, assignedTo: request.assignedTo };
  }
);

// State interface
interface SupportTicketsState {
  tickets: SupportTicketDto[];
  selectedTicket: SupportTicketDto | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  searchParams: SupportTicketSearchParams;
}

// Initial state
const initialState: SupportTicketsState = {
  tickets: [],
  selectedTicket: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  searchParams: {
    page: 1,
    pageSize: 20
  }
};

// Slice
const supportTicketsSlice = createSlice({
  name: 'supportTickets',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<SupportTicketSearchParams>) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch support tickets
    builder
      .addCase(fetchSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportTickets.fulfilled, (state, action: PayloadAction<SupportTicketsResponse>) => {
        state.loading = false;
        state.tickets = action.payload.items;
        state.totalCount = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch support tickets';
      });

    // Fetch support ticket by ID
    builder
      .addCase(fetchSupportTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportTicketById.fulfilled, (state, action: PayloadAction<SupportTicketDto>) => {
        state.loading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchSupportTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch support ticket details';
      });

    // Update ticket status
    builder
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const { ticketId, newStatus } = action.payload;
        const ticket = state.tickets.find(t => t.ticketId === ticketId);
        if (ticket) {
          ticket.status = newStatus;
          ticket.lastUpdatedAt = new Date().toISOString();
        }
        if (state.selectedTicket && state.selectedTicket.ticketId === ticketId) {
          state.selectedTicket.status = newStatus;
          state.selectedTicket.lastUpdatedAt = new Date().toISOString();
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update ticket status';
      });

    // Add internal note
    builder
      .addCase(addInternalNote.fulfilled, (state, action) => {
        const { ticketId } = action.payload;
        // Note: The actual note data would be returned from the API
        // For now, we'll trigger a refetch of the ticket details
        if (state.selectedTicket && state.selectedTicket.ticketId === ticketId) {
          state.selectedTicket.lastUpdatedAt = new Date().toISOString();
        }
      })
      .addCase(addInternalNote.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add internal note';
      });

    // Assign ticket
    builder
      .addCase(assignTicket.fulfilled, (state, action) => {
        const { ticketId, assignedTo } = action.payload;
        const ticket = state.tickets.find(t => t.ticketId === ticketId);
        if (ticket) {
          ticket.assignedTo = assignedTo;
          ticket.lastUpdatedAt = new Date().toISOString();
        }
        if (state.selectedTicket && state.selectedTicket.ticketId === ticketId) {
          state.selectedTicket.assignedTo = assignedTo;
          state.selectedTicket.lastUpdatedAt = new Date().toISOString();
        }
      })
      .addCase(assignTicket.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to assign ticket';
      });
  }
});

export const { setSearchParams, clearSelectedTicket, clearError } = supportTicketsSlice.actions;
export default supportTicketsSlice.reducer;
