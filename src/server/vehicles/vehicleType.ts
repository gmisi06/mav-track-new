// Az EMMA vehicleId-ja "<feed>:<12 jegyű UIC-járműszám>" alakú, pl. "1:915504800078".
// A járműszám: 2 jegy típuskód, 2 jegy országkód, 4 jegy sorozat/sorszám eleje, 3 jegy sorszám, 1 ellenőrző jegy.

// Típuskód -> ismeretlen sorozatnál használt általános leírás.
const GENERIC_NAMES: Record<string, string> = {
  '91': 'sorozatú villamos mozdony',
  '92': 'sorozatú dízelmozdony',
  '94': 'sorozatú villamos motorvonat',
  '95': 'sorozatú dízel motorvonat',
};

// Országkód -> sorozat -> típus.
const KNOWN_TYPES: Record<string, Record<string, string>> = {
  '55': {
    '470': 'Bombardier Traxx',
    '471': 'Bombardier Traxx',
    '480': 'Bombardier Traxx',
    '431': 'MÁV V43',
    '432': 'MÁV V43',
    '433': 'MÁV V43',
    '630': 'MÁV V63',
    // Motorvonatok (forrás: vonatosszeallitas.hu, a "14-15"-féle jelölés = 1415 a járműszámban).
    '415': 'Stadler FLIRT',
    '815': 'Stadler KISS',
    '425': 'Bombardier Talent',
    '426': 'Siemens Desiro',
    '416': 'Metrovagonmash (Uzsgyi)',
    '414': 'Ganz villamos motorvonat',
    '424': 'Ganz villamos motorvonat',
    '434': 'Ganz villamos motorvonat',
    '117': 'Tatra Bzmot',
    '127': 'Bzmot',
    '136': 'Bzmot',
  },
  '80': {
    '182': 'Siemens Taurus (ES64U2)',
    '193': 'Siemens Vectron',
  },
  '81': {
    '1116': 'Siemens Taurus (ÖBB 1116)',
  },
};

/** A járműszámból kiolvasható mozdonytípus, vagy undefined, ha nem ismerjük. */
export function getVehicleType(vehicleId?: string): string | undefined {
  const number = vehicleId?.split(':').pop();
  if (!number || !/^\d{12}$/.test(number)) return undefined;

  const typeCode = number.slice(0, 2);
  const country = number.slice(2, 4);
  const genericName = GENERIC_NAMES[typeCode];
  if (!genericName) return undefined;

  // A magyar és német számoknál a sorozat előtt egy tulajdonosi jegy áll (pl. 0480, 6193).
  const series = country === '81' ? number.slice(4, 8) : number.slice(5, 8);
  return KNOWN_TYPES[country]?.[series] ?? `${series} ${genericName}`;
}
