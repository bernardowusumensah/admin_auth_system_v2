import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const supportTicketsApi = createApi({
  reducerPath: 'supportTicketsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/support/tickets' }),
  endpoints: (builder) => ({
    getTickets: builder.query<any, void>({
      query: () => '',
    }),
    getTicketById: builder.query<any, string>({
      query: (id) => `/${id}`,
    }),
    createTicket: builder.mutation<any, any>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
    updateTicketStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
    }),
    addInternalNote: builder.mutation<any, { id: string; note: string }>({
      query: ({ id, note }) => ({
        url: `/${id}/notes`,
        method: 'POST',
        body: { note },
      }),
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketStatusMutation,
  useAddInternalNoteMutation,
} = supportTicketsApi;
