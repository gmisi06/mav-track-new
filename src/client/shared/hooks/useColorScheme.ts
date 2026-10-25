import { useSyncExternalStore } from "react";

export type ColorScheme = "light" | "dark";

const QUERY = "(prefers-color-scheme: dark)";

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

/** A rendszer világos/sötét beállítása; váltáskor újrarenderel. */
export function useColorScheme(): ColorScheme {
  return useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(QUERY).matches ? "dark" : "light"),
    () => "light"
  );
}
