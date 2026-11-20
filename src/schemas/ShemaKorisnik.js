import { z } from 'zod'

const noNumbersRegex = /^([^0-9]*)$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/

export const ShemaOperater = z.object({
  ime: z.string()
    .min(1, "Ime je obavezno!")
    .min(2, "Ime mora imati najmanje 2 znaka!")
    .regex(noNumbersRegex, "Ime ne smije sadržavati brojeve!")
    .trim(),

  prezime: z.string()
    .min(1, "Prezime je obavezno!")
    .min(2, "Prezime mora imati najmanje 2 znaka!")
    .regex(noNumbersRegex, "Prezime ne smije sadržavati brojeve!")
    .trim(),

  email: z.string()
    .min(1, "Email je obavezan!")
    .email("Unesite ispravan email format!")
    .trim(),

  lozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpunkcijski znak!"),

  uloga: z.enum(['Admin', 'Korisnik'], {
    errorMap: () => ({ message: "Uloga mora biti 'Admin' ili 'Korisnik'!" })
  })
})

export const ShemaLogin = z.object({
  email: z.string()
    .min(1, "Email je obavezan!")
    .email("Unesite ispravan email format!")
    .trim(),

  lozinka: z.string()
    .min(1, "Lozinka je obavezna!")
})

export const ShemaPromjenaLozinke = z.object({
  novaLozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpunkcijski znak!"),

  potvrdaLozinke: z.string()
    .min(1, "Potvrda lozinke je obavezna!")
}).refine((data) => data.novaLozinka === data.potvrdaLozinke, {
  message: "Lozinke se ne podudaraju!",
  path: ["potvrdaLozinke"]
})