import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react";

interface MyPositionState {
  coordinates: null | {
    lon: number;
    lat: number;
  };
}

const initialState: MyPositionState = {
  coordinates: null,
};

const myPositionSlice = createSlice({
  name: "myPosition",
  initialState,
  reducers: {
    setMyPosition(state, action: PayloadAction<any>) {
      state.coordinates = action.payload;
    },
    clearMyPosition(state) {
      state.coordinates = null;
    },
  },
});

export const { setMyPosition, clearMyPosition } = myPositionSlice.actions;

export default myPositionSlice.reducer;
