import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@app/store';
import type { SupportTicketSearchParams, UpdateTicketStatusRequest, AddInternalNoteRequest, AssignTicketRequest } from '@core/types';
import {
  fetchSupportTickets,
  fetchSupportTicketById,
  updateTicketStatus,
  addInternalNote,
  assignTicket,
  setSearchParams,
  clearSelectedTicket,
  clearError
} from '@modules/support/store/support-tickets.slice';

export const useSupportTickets = () => {
  const dispatch: AppDispatch = useDispatch();
  const { 
    tickets, 
    selectedTicket, 
    totalCount, 
    currentPage, 
    totalPages, 
    loading, 
    error, 
    searchParams 
  } = useSelector((state: RootState) => state.supportTickets);

  const loadTickets = useCallback((params?: SupportTicketSearchParams) => {
    const searchParams = params || {};
    dispatch(fetchSupportTickets(searchParams));
  }, [dispatch]);

  const loadTicketById = useCallback((ticketId: string) => {
    dispatch(fetchSupportTicketById(ticketId));
  }, [dispatch]);

  const updateStatus = useCallback((ticketId: string, request: UpdateTicketStatusRequest) => {
    dispatch(updateTicketStatus({ ticketId, request }));
  }, [dispatch]);

  const addNote = useCallback((ticketId: string, request: AddInternalNoteRequest) => {
    dispatch(addInternalNote({ ticketId, request }));
  }, [dispatch]);

  const assignTo = useCallback((ticketId: string, request: AssignTicketRequest) => {
    dispatch(assignTicket({ ticketId, request }));
  }, [dispatch]);

  const updateSearchParams = useCallback((params: SupportTicketSearchParams) => {
    dispatch(setSearchParams(params));
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedTicket());
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    tickets,
    selectedTicket,
    totalCount,
    currentPage,
    totalPages,
    loading,
    error,
    searchParams,
    
    // Actions
    loadTickets,
    loadTicketById,
    updateStatus,
    addNote,
    assignTo,
    updateSearchParams,
    clearSelected,
    clearErrors
  };
};
