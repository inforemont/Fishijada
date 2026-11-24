import KorisnikService from "./KorisnikService"
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = "service_uqdlvyw"
const EMAILJS_TEMPLATE_ID = "template_u47ixqm"
const EMAILJS_PUBLIC_KEY = "wMDWN0bTrLhVUFnWS"

class AuthService {
    async prijava(korisnickiPodaci) {
        const korisnik = await KorisnikService.prijava(korisnickiPodaci.email, korisnickiPodaci.lozinka)
        
        if (korisnik) {
            localStorage.setItem("prijavljeniKorisnik", JSON.stringify(korisnik))
        }
        return korisnik
    }

    odjava() {
        localStorage.removeItem("prijavljeniKorisnik")
    }

    dohvatiPrijavljenogKorisnika() {
        const korisnik = localStorage.getItem("prijavljeniKorisnik")
        return korisnik ? JSON.parse(korisnik) : null
    }

    async azurirajProfil(podaci) {
        const trenutni = this.dohvatiPrijavljenogKorisnika()
        if (!trenutni) throw new Error("Korisnik nije prijavljen")

        const odgovor = await KorisnikService.promjeni(trenutni.sifra, podaci)
        if (odgovor.data) {
            localStorage.setItem("prijavljeniKorisnik", JSON.stringify(odgovor.data))
        }
        return odgovor.data
    }

    async zatraziResetLozinke(email) {
        const odgovor = await KorisnikService.get()
        const korisnici = odgovor.data || []

        const korisnik = korisnici.find(k => k.email.toLowerCase() === email.trim().toLowerCase())

        if (!korisnik) {
            throw new Error("Korisnik s tom e-mail adresom ne postoji u sustavu.")
        }

        const slucajniBroj = Math.floor(1000 + Math.random() * 9000)
        const novaPrivremenaLozinka = `Fisi${slucajniBroj}!`

        await KorisnikService.promjeni(korisnik.sifra, {
            ...korisnik,
            lozinka: novaPrivremenaLozinka
        })

        const templateParams = {
            to_email: korisnik.email,
            to_name: korisnik.ime || korisnik.email,
            nova_lozinka: novaPrivremenaLozinka
        }

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        )

        return { success: true, message: "Nova lozinka je uspješno poslana na vaš e-mail!" }
    }
}

export default new AuthService()