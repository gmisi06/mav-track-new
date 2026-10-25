import { useCallback, useSyncExternalStore } from "react";
import {
  THEME_STORAGE_KEY,
  isThemePreference,
  resolveTheme,
  type ColorScheme,
  type ThemePreference,
} from "../theme";

export type { ColorScheme, ThemePreference };

const QUERY = "(prefers-color-scheme: dark)";
const CHANGE_EVENT = "theme-preference-change";

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(stored)) return stored;
  } catch {
    // A tárhely le lehet tiltva (privát mód), ilyenkor a rendszer beállítását követjük.
  }
  return "system";
};

/** A választott téma a <html data-theme> attribútumon is megjelenik, a CSS ebből dolgozik. */
export const applyTheme = (preference: ThemePreference): ColorScheme => {
  const scheme = resolveTheme(preference, window.matchMedia(QUERY).matches);
  document.documentElement.dataset.theme = scheme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", scheme === "dark" ? "#14181f" : "#0057be");
  return scheme;
};

/** Induláskor: a tárolt választás érvényesítése (pl. a theme-color meta frissítése). */
export const syncTheme = () => applyTheme(readPreference());

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(QUERY);
  const update = () => {
    applyTheme(readPreference());
    onChange();
  };
  mediaQuery.addEventListener("change", update);
  window.addEventListener(CHANGE_EVENT, update);
  window.addEventListener("storage", update);
  return () => {
    mediaQuery.removeEventListener("change", update);
    window.removeEventListener(CHANGE_EVENT, update);
    window.removeEventListener("storage", update);
  };
};

/** A ténylegesen használt téma (a "rendszer" már feloldva); váltáskor újrarenderel. */
export function useColorScheme(): ColorScheme {
  return useSyncExternalStore(
    subscribe,
    () => resolveTheme(readPreference(), window.matchMedia(QUERY).matches),
    () => "light"
  );
}

/** A felhasználó választása (rendszer / világos / sötét) és beállítója. */
export function useThemePreference(): [
  ThemePreference,
  (preference: ThemePreference) => void
] {
  const preference = useSyncExternalStore(
    subscribe,
    readPreference,
    () => "system" as ThemePreference
  );

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Nem mentődik, de a váltás az oldal élete alatt érvényes marad.
    }
    applyTheme(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return [preference, setPreference];
}
