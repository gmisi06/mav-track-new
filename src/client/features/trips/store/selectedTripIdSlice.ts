import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react";

interface SelectedTripIdState {
  tripId: string | number | null;
}

const initialState: SelectedTripIdState = {
  tripId: null,
};

const selectedTripIdSlice = createSlice({
  name: "selectedTripId",
  initialState,
  reducers: {
    setSelectedTripId(state, action: PayloadAction<any>) {
      state.tripId = action.payload;
    },
    clearSelectedTripId(state) {
      state.tripId = null;
    },
  },
});

export const { setSelectedTripId, clearSelectedTripId } =
  selectedTripIdSlice.actions;

export default selectedTripIdSlice.reducer;
