import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 768px)";

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

/** Mobil nézet (alsó lap) vagy desktop (oldalsáv). */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
