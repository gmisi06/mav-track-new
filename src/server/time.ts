const TIME_ZONE = 'Europe/Budapest';

const partsFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

// A Vercel szerverei UTC-ben futnak, a MÁV adatai viszont magyar idő szerintiek.
function budapestParts(date: Date) {
  const parts: Record<string, string> = {};
  for (const { type, value } of partsFormatter.formatToParts(date)) {
    parts[type] = value;
  }
  return parts;
}

/** Aktuális menetrendi nap (YYYY-MM-DD) magyar idő szerint. */
export function getServiceDay(date = new Date()): string {
  const p = budapestParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

/** Éjfél óta eltelt másodpercek magyar idő szerint. */
export function getSecondsSinceMidnight(date = new Date()): number {
  const p = budapestParts(date);
  return Number(p.hour) * 3600 + Number(p.minute) * 60 + Number(p.second);
}
