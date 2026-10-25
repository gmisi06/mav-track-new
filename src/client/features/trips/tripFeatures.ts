export type TripFeature = {
  key: string;
  icon: string;
  label: string;
};

const OCCUPANCY_LABELS: Record<string, string> = {
  EMPTY: "Üres",
  MANY_SEATS_AVAILABLE: "Sok szabad hely",
  FEW_SEATS_AVAILABLE: "Kevés szabad hely",
  STANDING_ROOM_ONLY: "Csak állóhely",
  CRUSHED_STANDING_ROOM_ONLY: "Zsúfolt",
  FULL: "Megtelt",
};

/** Az üres és ismeretlen állapotokat nem jelenítjük meg. */
export function occupancyLabel(status?: string): string | null {
  return (status && OCCUPANCY_LABELS[status]) || null;
}

export function accessibilityFeature(value?: string): TripFeature | null {
  if (value === "POSSIBLE")
    return { key: "wheelchair", icon: "♿", label: "Akadálymentesen elérhető" };
  if (value === "NOT_POSSIBLE")
    return { key: "wheelchair", icon: "♿", label: "Nem akadálymentes" };
  return null;
}

export function bikeFeature(value?: string): TripFeature | null {
  if (value === "ALLOWED")
    return { key: "bike", icon: "🚲", label: "Kerékpár szállítható" };
  if (value === "NOT_ALLOWED")
    return { key: "bike", icon: "🚲", label: "Kerékpár nem szállítható" };
  return null;
}

export type ComfortRow = {
  name: string;
  reservation: "MANDATORY" | "POSSIBLE";
  from?: string;
  till?: string;
};

/** Csak a helyjegyköteles vagy helyjeggyel igényelhető szakaszokat mutatjuk. */
export function reservationRows(levels?: any[] | null): ComfortRow[] {
  return (levels ?? []).flatMap((level) => {
    const reservation = level?.placeReservation;
    const name = level?.comfortLevel?.name;
    if (!name || (reservation !== "MANDATORY" && reservation !== "POSSIBLE"))
      return [];
    return [
      {
        name,
        reservation,
        from: level.fromStop?.name,
        till: level.tillStop?.name,
      } as ComfortRow,
    ];
  });
}
