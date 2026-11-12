import { z } from 'zod';

export const ShemaLokacija = z.object({
  regija: z.string()
    .min(1, "Regija je obavezna!")
    .trim(),

  mjesto: z.string()
    .min(1, "Naziv mjesta je obavezan!")
    .trim(),

  zupanija: z.string()
    .min(1, "Županija je obavezna!")
    .trim(),

  posta: z.number({ invalid_type_error: "Poštanski broj mora biti broj!" })
    .min(10000, "Poštanski broj mora imati 5 znamenaka!")
    .max(99999, "Poštanski broj mora imati 5 znamenaka!"),

  datumOdrzavanja: z.string()
    .min(1, "Datum održavanja je obavezan!"),

  slika: z.string().optional(),

  ekipe: z.array(z.any()).optional()
});