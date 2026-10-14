import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tripsApiSlice = createApi({
  reducerPath: "tripsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/trips`,
  }),

  endpoints: (builder) => ({
    getTrip: builder.query<any, any>({
      query: (id: number) => `/${id}`,
    }),
  }),
});

export const { useGetTripQuery, useLazyGetTripQuery } = tripsApiSlice;
