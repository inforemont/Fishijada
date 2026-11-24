import { z } from 'zod';

export const ShemaFishijada = z.object({
  naziv: z.string()
    .min(3, "Naziv mora imati najmanje 3 znaka!")
    .max(30, "Naziv može imati najviše 30 znakova!")
    .trim(),

  mjestoOdrzavanja: z.string()
    .min(1, "Mjesto održavanja (adresa) je obavezno!")
    .trim(),

  cijena: z.number({ 
    required_error: "Kotizacija je obavezna!",
    invalid_type_error: "Kotizacija mora biti broj!" 
  })
    .min(1, "Kotizacija mora biti najmanje 1 €!")
    .max(300, "Kotizacija može iznositi najviše 300 €!"),

  datumPokretanja: z.string()
    .min(1, "Datum održavanja je obavezan!"),

  aktivan: z.boolean().optional(),

  lokacije: z.array(z.any()).optional()
})