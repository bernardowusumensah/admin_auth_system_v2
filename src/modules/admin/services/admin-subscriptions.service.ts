import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminSubscriptionsApi = createApi({
  reducerPath: 'adminSubscriptionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/admin/subscriptions' }),
  endpoints: (builder) => ({
    getAdminSubscriptions: builder.query<any, void>({
      query: () => '',
    }),
    getAdminSubscriptionById: builder.query<any, string>({
      query: (id) => `/${id}`,
    }),
    createAdminSubscription: builder.mutation<any, any>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetAdminSubscriptionsQuery,
  useGetAdminSubscriptionByIdQuery,
  useCreateAdminSubscriptionMutation,
} = adminSubscriptionsApi;
