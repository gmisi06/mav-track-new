import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react";

interface ToastState {
  /** A megjelenített üzenet; a `id` minden új üzenetnél nő, így az azonos szöveg is újraindítja az időzítőt. */
  message: string | null;
  id: number;
}

const initialState: ToastState = { message: null, id: 0 };

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<string>) {
      state.message = action.payload;
      state.id += 1;
    },
    hideToast(state) {
      state.message = null;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
