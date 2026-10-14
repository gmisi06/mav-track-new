import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react";

interface VehiclesState {
  vehicles: any[];
}

const initialState: VehiclesState = {
  vehicles: [],
};

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    setVehicles(state, action: PayloadAction<any[]>) {
      state.vehicles = action.payload;
    },
    clearVehicles(state) {
      state.vehicles = [];
    },
  },
});

export const { setVehicles, clearVehicles } = vehiclesSlice.actions;

export default vehiclesSlice.reducer;
