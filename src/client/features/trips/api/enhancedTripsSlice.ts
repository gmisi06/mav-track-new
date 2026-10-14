import { tripsApiSlice } from "./tripsApiSlice";

export const enhancedTrips = tripsApiSlice.enhanceEndpoints({
  addTagTypes: ["Trip"],
  endpoints: {
    getTrip: {
      providesTags: ["Trip"],
    },
  },
});
