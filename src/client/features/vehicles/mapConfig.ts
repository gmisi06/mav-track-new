// Az alaptérkép stílusa felülírható a NEXT_PUBLIC_MAP_STYLE_URL környezeti változóval.
export const MAP_STYLE_URL =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
  "https://tiles.openfreemap.org/styles/liberty";

// Sötét módban az OpenFreeMap sötét stílusa; felülírható a NEXT_PUBLIC_MAP_STYLE_URL_DARK változóval.
export const MAP_STYLE_URL_DARK =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL_DARK ??
  "https://tiles.openfreemap.org/styles/dark";

// A MapLibre 512 px-es csempékkel számol, ezért ugyanaz a méretarány eggyel
// kisebb zoomszint, mint a korábbi (256 px-es) Leaflet térképen.
export const INITIAL_VIEW = {
  longitude: 19.5063,
  latitude: 47.0956,
  zoom: 7,
};
export const MIN_ZOOM = 7;
export const FOCUS_ZOOM = 11;
export const STOPS_MIN_ZOOM = 11;

export const LAYER_IDS = {
  tripLine: "trip-line",
  tripLineCasing: "trip-line-casing",
  stops: "train-stops",
  vehicleHeadings: "vehicle-headings",
  vehicles: "vehicles",
} as const;

export const MAP_LOCALE = {
  "NavigationControl.ZoomIn": "Nagyítás",
  "NavigationControl.ZoomOut": "Kicsinyítés",
  "GeolocateControl.FindMyLocation": "Ugrás a jelenlegi pozíciómra",
  "GeolocateControl.LocationNotAvailable": "A pozíció nem elérhető",
};
