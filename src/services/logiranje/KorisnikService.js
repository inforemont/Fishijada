import KorisnikServiceLocalStorage from "./KorisnikServiceLocalStorage"
import KorisnikServiceFirebase from "./KorisnikServiceFirebase"
import { DATA_SOURCE } from "../../constants"

let Servis = null

switch (DATA_SOURCE) {
    case 'localStorage':
        Servis = KorisnikServiceLocalStorage
        break
    case 'firebase':
        Servis = KorisnikServiceFirebase
        break
    default:
        Servis = KorisnikServiceLocalStorage
}

const PrazanServis = {
    get: async () => ({ data: [] }),
    dodaj: async () => { console.error('Servis nije implementiran') },
    getBySifra: async () => ({ data: {} }),
    promjeni: async () => { console.error('Servis nije implementiran') },
    obrisi: async () => { console.error('Servis nije implementiran') },
    prijava: async () => { throw new Error('Servis nije implementiran') }
}

const AktivniServis = Servis || PrazanServis

export default {
    get: () => AktivniServis.get(),
    dodaj: (korisnik) => AktivniServis.dodaj(korisnik),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    promjeni: (sifra, korisnik) => AktivniServis.promjeni(sifra, korisnik),
    obrisi: (sifra) => AktivniServis.obrisi(sifra),
    prijava: (email, lozinka) => AktivniServis.prijava(email, lozinka)
}