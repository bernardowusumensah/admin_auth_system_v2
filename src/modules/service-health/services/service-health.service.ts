import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serviceHealthApi = createApi({
  reducerPath: 'serviceHealthApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/admin/health' }),
  endpoints: (builder) => ({
    getServiceHealth: builder.query<any, void>({
      query: () => '',
    }),
  }),
});

export const { useGetServiceHealthQuery } = serviceHealthApi;
