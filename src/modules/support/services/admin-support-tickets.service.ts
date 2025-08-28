import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminSupportTicketsApi = createApi({
  reducerPath: 'adminSupportTicketsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/admin/support/tickets' }),
  endpoints: (builder) => ({
    getAdminTickets: builder.query<any, void>({
      query: () => '',
    }),
    getAdminTicketById: builder.query<any, string>({
      query: (id) => `/${id}`,
    }),
    updateAdminTicketStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
    }),
    addAdminInternalNote: builder.mutation<any, { id: string; note: string }>({
      query: ({ id, note }) => ({
        url: `/${id}/notes`,
        method: 'POST',
        body: { note },
      }),
    }),
  }),
});

export const {
  useGetAdminTicketsQuery,
  useGetAdminTicketByIdQuery,
  useUpdateAdminTicketStatusMutation,
  useAddAdminInternalNoteMutation,
} = adminSupportTicketsApi;
