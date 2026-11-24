import PrijavaServiceMemorija from "./PrijavaServiceMemorija"
import PrijavaServiceLocalStorage from "./PrijavaServiceLocalStorage"
import PrijavaServiceFirebase from "./PrijavaServiceFirebase"
import { DATA_SOURCE as DEFAULT_DATA_SOURCE } from "../../constants"

const PrazanServis = {
    get: async () => ({ data: [] }),
    dodaj: async (Prijava) => { console.error('Servis nije implementiran'); },
    getBySifra: async (sifra) => ({ data: {} }),
    promjeni: async (sifra, Prijava) => { console.error('Servis nije implementiran'); },
    obrisi: async (sifra) => { console.error('Servis nije implementiran'); },
};

const getAktivniServis = () => {
    const trenutniIzvor = localStorage.getItem('odabraniIzvorPodataka') || DEFAULT_DATA_SOURCE;

    switch (trenutniIzvor) {
        case 'memorija':
            return PrijavaServiceMemorija;
        case 'localStorage':
            return PrijavaServiceLocalStorage;
        case 'firebase':
            return PrijavaServiceFirebase;
        default:
            return PrazanServis;
    }
};

export default {
    get: () => getAktivniServis().get(),
    dodaj: (Prijava) => getAktivniServis().dodaj(Prijava),
    getBySifra: (sifra) => getAktivniServis().getBySifra(sifra),
    promjeni: (sifra, Prijava) => getAktivniServis().promjeni(sifra, Prijava),
    obrisi: (sifra) => getAktivniServis().obrisi(sifra),
}