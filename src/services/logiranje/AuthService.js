import axios from 'axios'

const API_URL = "http://localhost:8080/api/auth" 

class AuthService {
    async prijava(korisnickiPodaci) {
        const odgovor = await axios.post(`${API_URL}/login`, korisnickiPodaci)
        if (odgovor.data) {
            localStorage.setItem("prijavljeniKorisnik", JSON.stringify(odgovor.data))
        }
        return odgovor.data
    }

    odjava() {
        localStorage.removeItem("prijavljeniKorisnik")
    }

    dohvatiPrijavljenogKorisnika() {
        const korisnik = localStorage.getItem("prijavljeniKorisnik")
        return korisnik ? JSON.parse(korisnik) : null
    }

    async azurirajProfil(podaci) {
        const odgovor = await axios.put(`${API_URL}/profil`, podaci)
        if (odgovor.data) {
            localStorage.setItem("prijavljeniKorisnik", JSON.stringify(odgovor.data))
        }
        return odgovor.data
    }

    async zatraziResetLozinke(email) {
        return await axios.post(`${API_URL}/zaboravljena-lozinka`, { email })
    }
}

export default new AuthService()