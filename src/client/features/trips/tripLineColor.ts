// A .env-ben a "#" kommentet kezd, ezért a szín megadható "#" nélkül is (F6AC00).
const configuredColor = process.env.NEXT_PUBLIC_TRIP_LINE_COLOR?.trim();

export const TRIP_LINE_COLOR = configuredColor
  ? /^[0-9a-f]{3,8}$/i.test(configuredColor)
    ? `#${configuredColor}`
    : configuredColor
  : "#274f96";
