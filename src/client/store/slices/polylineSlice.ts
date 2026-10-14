import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react";

interface PolylineState {
  polyline: string | null;
}

const initialState: PolylineState = {
  polyline: null,
};

const polylineSlice = createSlice({
  name: "polyline",
  initialState,
  reducers: {
    setPolyline(state, action: PayloadAction<any>) {
      state.polyline = action.payload;
    },
    clearPolyline(state) {
      state.polyline = null;
    },
  },
});

export const { setPolyline, clearPolyline } = polylineSlice.actions;

export default polylineSlice.reducer;
