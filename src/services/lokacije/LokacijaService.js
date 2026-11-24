import LokacijaServiceMemorija from "./LokacijaServiceMemorija"
import LokacijaServiceLocalStorage from "./LokacijaServiceLocalStorage"
import LokacijaServiceFirebase from "./LokacijaServiceFirebase"
import { DATA_SOURCE as DEFAULT_DATA_SOURCE } from "../../constants"

const PrazanServis = {
    get: async () => ({ data: [] }),
    dodaj: async (Lokacija) => { console.error('Servis nije implementiran'); },
    getBySifra: async (sifra) => ({ data: {} }),
    promjeni: async (sifra, Lokacija) => { console.error('Servis nije implementiran'); },
    obrisi: async (sifra) => { console.error('Servis nije implementiran'); },
};

const getAktivniServis = () => {
    const trenutniIzvor = localStorage.getItem('odabraniIzvorPodataka') || DEFAULT_DATA_SOURCE;

    switch (trenutniIzvor) {
        case 'memorija':
            return LokacijaServiceMemorija;
        case 'localStorage':
            return LokacijaServiceLocalStorage;
        case 'firebase':
            return LokacijaServiceFirebase;
        default:
            return PrazanServis;
    }
};

export default {
    get: () => getAktivniServis().get(),
    dodaj: (Lokacija) => getAktivniServis().dodaj(Lokacija),
    getBySifra: (sifra) => getAktivniServis().getBySifra(sifra),
    promjeni: (sifra, Lokacija) => getAktivniServis().promjeni(sifra, Lokacija),
    obrisi: (sifra) => getAktivniServis().obrisi(sifra),
}