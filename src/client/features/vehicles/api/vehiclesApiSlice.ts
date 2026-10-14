import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const vehiclesApiSlice = createApi({
  reducerPath: "vehiclesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/vehicles`,
  }),

  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: () => "",
    }),
  }),
});

export const { useGetVehiclesQuery, useLazyGetVehiclesQuery } =
  vehiclesApiSlice;
