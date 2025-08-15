import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../../store.ts';
import { API_BASE_URL, API_HASSAN_URL } from '@env';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
   /*  baseUrl: `${API_BASE_URL}`, */
    baseUrl: `${API_HASSAN_URL}`,
   
   /*  prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }, */
   /*  credentials: 'include', */
  }),

  tagTypes: ['LIST', 'ENTITY', 'STATS'],
  endpoints: () => ({}),
});

export const { reducerPath, middleware } = apiSlice;
