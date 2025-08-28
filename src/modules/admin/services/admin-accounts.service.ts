import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminAccountsApi = createApi({
  reducerPath: 'adminAccountsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/admin/accounts' }),
  endpoints: (builder) => ({
    getAdminAccounts: builder.query<any, void>({
      query: () => '',
    }),
    getAdminAccountById: builder.query<any, string>({
      query: (id) => `/${id}`,
    }),
    createAdminAccount: builder.mutation<any, any>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetAdminAccountsQuery,
  useGetAdminAccountByIdQuery,
  useCreateAdminAccountMutation,
} = adminAccountsApi;
