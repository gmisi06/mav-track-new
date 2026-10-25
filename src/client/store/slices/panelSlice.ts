import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react";

interface PanelState {
  /** Az információs panel (oldalsáv / alsó lap) ki van-e nyitva. */
  open: boolean;
}

const initialState: PanelState = { open: false };

const panelSlice = createSlice({
  name: "panel",
  initialState,
  reducers: {
    setPanelOpen(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
  },
});

export const { setPanelOpen } = panelSlice.actions;

export default panelSlice.reducer;
