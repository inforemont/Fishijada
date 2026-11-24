import KorisnikServiceLocalStorage from "./KorisnikServiceLocalStorage"
import KorisnikServiceFirebase from "./KorisnikServiceFirebase"
import KorisnikServiceMemorija from "./KorisnikServiceMemorija"
import { DATA_SOURCE as DEFAULT_DATA_SOURCE } from "../../constants"

const PrazanServis = {
    get: async () => ({ data: [] }),
    dodaj: async () => ({ success: false, message: 'Servis nije implementiran' }),
    getBySifra: async () => ({ data: {} }),
    promjeni: async () => ({ success: false, message: 'Servis nije implementiran' }),
    obrisi: async () => ({ success: false, message: 'Servis nije implementiran' }),
    prijava: async () => { throw new Error('Servis nije implementiran') }
};

function getAktivniServis() {
    const trenutniIzvor = localStorage.getItem('odabraniIzvorPodataka') || DEFAULT_DATA_SOURCE;

    if (trenutniIzvor === 'memorija') return KorisnikServiceMemorija;
    if (trenutniIzvor === 'localStorage') return KorisnikServiceLocalStorage;
    if (trenutniIzvor === 'firebase') return KorisnikServiceFirebase;
    
    return PrazanServis;
}

export default {
    get: async () => await getAktivniServis().get(),
    dodaj: async (korisnik) => await getAktivniServis().dodaj(korisnik),
    getBySifra: async (sifra) => await getAktivniServis().getBySifra(sifra),
    promjeni: async (sifra, korisnik) => await getAktivniServis().promjeni(sifra, korisnik),
    obrisi: async (sifra) => await getAktivniServis().obrisi(sifra),
    prijava: async (email, lozinka) => await getAktivniServis().prijava(email, lozinka),
}