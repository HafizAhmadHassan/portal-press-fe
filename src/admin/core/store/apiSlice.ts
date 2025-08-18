import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../../store.ts';

//const baseUrl = import.meta.env.VITE_API_BASE_URL;
const apiHassanUrl = import.meta.env.VITE_API_HASSAN_URL;

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
   /*  baseUrl: `${API_BASE_URL}`, */
    baseUrl: `${apiHassanUrl}`,
   
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
