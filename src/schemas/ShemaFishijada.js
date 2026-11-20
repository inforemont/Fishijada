import { z } from 'zod';

const noNumbersRegex = /^([^0-9]*)$/;

export const ShemaFishijada = z.object({
  naziv: z.string()
    .min(5, "Naziv fišijade je obavezan!")
    .min(3, "Naziv mora imati najmanje 3 znaka!")
    .max(30, "Naziv može imati najviše 30 znakova!")
    .regex(noNumbersRegex, "Naziv fišijade ne smije sadržavati brojeve!")
    .trim(),

  mjestoOdrzavanja: z.string()
    .min(1, "Mjesto održavanja (adresa) je obavezno!")
    .trim(),

  cijena: z.number({ 
    error: "Pogrešan unos!" 
  })
    .min(0, "Kotizacija ne može biti negativna!"),

  datumPokretanja: z.string()
    .min(1, "Datum održavanja je obavezan!"),

  aktivan: z.boolean().optional(),

  lokacije: z.array(z.number()).optional()
})