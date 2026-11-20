import { z } from 'zod';

const noNumbersRegex = /^([^0-9]*)$/;

export const ShemaPrijava = z.object({
  imePrezime: z.string()
    .min(1, "Ime i prezime je obavezno!")
    .min(3, "Ime i prezime mora imati najmanje 3 znaka!")
    .regex(noNumbersRegex, "Ime i prezime ne smije sadržavati brojeve!")
    .trim(),

  ekipa: z.string()
    .min(1, "Naziv ekipe je obavezan!")
    .regex(noNumbersRegex, "Naziv ekipe ne smije sadržavati brojeve!")
    .trim(),


  email: z.string()
    .min(1, "Email je obavezan!")
    .email("Unesite ispravan email format!")
    .trim(),

  lokacija: z.number({ 
    error: "Pogrešan unos!" 
  })
    .min(1, "Molimo odaberite lokaciju!"),

  kotizacijaPlacena: z.boolean().optional(),

  prvenstvoHrvatske: z.boolean().optional()
})