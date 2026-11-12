import { z } from 'zod';

export const ShemaFishijada = z.object({
  naziv: z.string()
    .min(1, "Naziv fišijade je obavezan!")
    .min(3, "Naziv mora imati najmanje 3 znaka!")
    .max(50, "Naziv može imati najviše 50 znakova!")
    .trim(),

  mjestoOdrzavanja: z.string()
    .min(1, "Mjesto održavanja (adresa) je obavezno!")
    .trim(),

  cijena: z.number({ invalid_type_error: "Kotizacija mora biti broj!" })
    .min(0, "Kotizacija ne može biti negativna!"),

  datumPokretanja: z.string()
    .min(1, "Datum održavanja je obavezan!"),

  aktivan: z.boolean().optional(),

  lokacije: z.array(z.number()).optional()
});