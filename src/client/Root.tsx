"use client";

import { StrictMode } from "react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";

export default function Root() {
  return (
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
}
