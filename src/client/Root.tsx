"use client";

import { StrictMode, useEffect } from "react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";
import { syncTheme } from "./shared/hooks/useColorScheme";

export default function Root() {
  useEffect(() => {
    syncTheme();
  }, []);

  return (
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
}
