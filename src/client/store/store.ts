import { configureStore } from "@reduxjs/toolkit";
import { tripsApiSlice } from "../features/trips/api/tripsApiSlice";
import selectedTripId from "../features/trips/store/selectedTripIdSlice";
import vehicles from "../features/vehicles/store/vehiclesSlice";
import myPosition from "../features/vehicles/store/myPositionSlice";
import polyline from "./slices/polylineSlice";
import panel from "./slices/panelSlice";
import { vehiclesApiSlice } from "../features/vehicles/api/vehiclesApiSlice";

export const store = configureStore({
  reducer: {
    selectedTripId: selectedTripId,
    vehicles: vehicles,
    polyline: polyline,
    panel: panel,
    myPosition: myPosition,
    [tripsApiSlice.reducerPath]: tripsApiSlice.reducer,
    [vehiclesApiSlice.reducerPath]: vehiclesApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(tripsApiSlice.middleware)
      .concat(vehiclesApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
