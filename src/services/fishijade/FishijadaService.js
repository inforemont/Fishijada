import FishijadaServiceMemorija from "./FishijadaServiceMemorija"
import FishijadaServiceLocalStorage from "./FishijadaServiceLocalStorage"
import FishijadaServiceFirebase from "./FishijadaServiceFirebase"
import { DATA_SOURCE as DEFAULT_DATA_SOURCE } from "../../constants"

const getAktivniServis = () => {
    const trenutniIzvor = localStorage.getItem('odabraniIzvorPodataka') || DEFAULT_DATA_SOURCE;

    switch(trenutniIzvor){
        case 'memorija':
            return FishijadaServiceMemorija;
        case 'localStorage':
            return FishijadaServiceLocalStorage;
        case 'firebase':
            return FishijadaServiceFirebase;
        default:
            return PrazanServis;
    }
}

const PrazanServis = {
    get: async () => ({data:[]}),
    dodaj: async (fishijada) => { console.error('Servis nije implementiran'); },
    getBySifra: async (sifra) => ({data:{}}),
    promjeni: async (sifra, fishijada) => { console.error('Servis nije implementiran'); },
    obrisi: async (sifra) => { console.error('Servis nije implementiran'); },
}

export default {
    get: () => getAktivniServis().get(),
    dodaj: (fishijada) => getAktivniServis().dodaj(fishijada),
    getBySifra: (sifra) => getAktivniServis().getBySifra(sifra),
    promjeni: (sifra, fishijada) => getAktivniServis().promjeni(sifra, fishijada),
    obrisi: (sifra) => getAktivniServis().obrisi(sifra),
}