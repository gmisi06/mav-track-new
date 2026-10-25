import { z } from 'zod';

// Csak azokat a mezőket írjuk elő, amelyekre a kód támaszkodik; a többi átmegy (passthrough).
// Ha az EMMA formátuma megváltozik, itt derül ki, nem a feldolgozás közepén.

const stopSchema = z.looseObject({
  gtfsId: z.string().nullish(),
  name: z.string().nullish(),
});

const stopRelationshipSchema = z.looseObject({
  status: z.string(),
  stop: stopSchema,
});

const tripRefSchema = z.looseObject({
  gtfsId: z.string(),
});

export const vehiclePositionSchema = z.looseObject({
  vehicleId: z.string(),
  lat: z.number(),
  lon: z.number(),
  stopRelationship: stopRelationshipSchema.nullish(),
  trip: tripRefSchema,
});

export const vehiclePositionsDataSchema = z.object({
  vehiclePositions: z.array(z.unknown()),
});

export const tripDetailsDataSchema = z.object({
  trip: z.looseObject({
    stoptimes: z.array(z.looseObject({ stop: stopSchema })),
  }),
});

export const tripPolylineDataSchema = z.object({
  trip: z.object({
    tripGeometry: z.object({ points: z.string() }),
  }),
});

/**
 * Az elemeket egyenként ellenőrzi: egy hibás jármű nem dönti el az egész listát,
 * csak kimarad (a darabszámot visszaadjuk a naplózáshoz).
 */
export function parseVehiclePositions<T = z.infer<typeof vehiclePositionSchema>>(
  items: unknown[],
  schema: z.ZodType<T> = vehiclePositionSchema as unknown as z.ZodType<T>,
): { valid: T[]; invalid: number } {
  const valid: T[] = [];
  let invalid = 0;
  for (const item of items) {
    const result = schema.safeParse(item);
    if (result.success) valid.push(result.data);
    else invalid++;
  }
  return { valid, invalid };
}
