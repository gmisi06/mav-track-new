const DEFAULT_COLOR = "#274f96";

// A .env-ben a "#" kommentet kezd, ezért a szín megadható "#" nélkül is (F6AC00).
// Az idézőjeleket (pl. Vercelen véletlenül beírt "#F6AC00") levágjuk.
const normalize = (value: string | undefined) => {
  const color = value?.trim().replace(/^["']+|["']+$/g, "").trim();
  if (!color) return DEFAULT_COLOR;
  if (/^[0-9a-f]{3,8}$/i.test(color)) return `#${color}`;
  return /^#[0-9a-f]{3,8}$/i.test(color) ? color : DEFAULT_COLOR;
};

export const TRIP_LINE_COLOR = normalize(process.env.NEXT_PUBLIC_TRIP_LINE_COLOR);
