import KorisnikService from "./KorisnikService"

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
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: "Upute poslane na e-mail." })
            }, 1000)
        })
    }
}

export default new AuthService()