export type ThemePreference = "system" | "light" | "dark";
export type ColorScheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

const ORDER: ThemePreference[] = ["system", "light", "dark"];

export const isThemePreference = (value: unknown): value is ThemePreference =>
  value === "system" || value === "light" || value === "dark";

export const resolveTheme = (
  preference: ThemePreference,
  systemIsDark: boolean
): ColorScheme =>
  preference === "system" ? (systemIsDark ? "dark" : "light") : preference;

/** A kapcsoló gombnyomásra: rendszer → világos → sötét → rendszer. */
export const nextPreference = (current: ThemePreference): ThemePreference =>
  ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
