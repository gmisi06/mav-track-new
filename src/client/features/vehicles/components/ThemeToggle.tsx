import { createPortal } from "react-dom";
import { useControl } from "@vis.gl/react-maplibre";
import type { IControl } from "maplibre-gl";
import { useThemePreference } from "../../../shared/hooks/useColorScheme";
import { nextPreference, type ThemePreference } from "../../../shared/theme";

class ContainerControl implements IControl {
  private container = document.createElement("div");

  onAdd() {
    this.container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    return this.container;
  }

  onRemove() {
    this.container.remove();
  }

  getElement() {
    return this.container;
  }
}

const LABELS: Record<ThemePreference, string> = {
  system: "rendszer",
  light: "világos",
  dark: "sötét",
};

const ICONS: Record<ThemePreference, React.ReactNode> = {
  // Félig kitöltött kör: a rendszer beállítását követi.
  system: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </>
  ),
  dark: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
};

/** Téma-kapcsoló a térkép vezérlői között: rendszer → világos → sötét. */
const ThemeToggle = () => {
  const control = useControl(() => new ContainerControl(), {
    position: "top-left",
  });
  const [preference, setPreference] = useThemePreference();

  const label = `Téma: ${LABELS[preference]} (váltás: ${
    LABELS[nextPreference(preference)]
  })`;

  return createPortal(
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={() => setPreference(nextPreference(preference))}
      style={{ color: "var(--text)" }}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: "block", margin: "auto" }}
        aria-hidden="true"
      >
        {ICONS[preference]}
      </svg>
    </button>,
    control.getElement()
  );
};

export default ThemeToggle;
