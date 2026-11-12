import { z } from 'zod';

export const ShemaPrijava = z.object({
  imePrezime: z.string()
    .min(1, "Ime i prezime je obavezno!")
    .min(3, "Ime i prezime mora imati najmanje 3 znaka!")
    .trim(),

  ekipa: z.string()
    .min(1, "Naziv ekipe je obavezan!")
    .trim(),

  stol: z.number({ invalid_type_error: "Broj stola mora biti broj!" })
    .min(1, "Broj stola mora biti minimalno 1!"),

  email: z.string()
    .min(1, "Email je obavezan!")
    .email("Unesite ispravan email format!")
    .trim(),

  lokacija: z.number({ invalid_type_error: "Lokacija je obavezna!" })
    .min(1, "Molimo odaberite lokaciju!"),

  kotizacijaPlacena: z.boolean().optional(),

  prvenstvoHrvatske: z.boolean().optional()
});