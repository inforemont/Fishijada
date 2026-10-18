import FishijadaServiceMemorija from "./FishijadaServiceMemorija"
import { DATA_SOURCE } from "../constants"
import FishijadaServiceLocalStorage from "./FishijadaServiceLocalStorage"

let Servis = null
switch(DATA_SOURCE){
    case 'memorija':
        Servis= FishijadaServiceMemorija
        break
    case 'localStorage':
        Servis=FishijadaServiceLocalStorage
        break
    default:
        Servis=null
}

const PrazanServis = {
        get:async ()=>({data:[]}),
        dodaj: async (fishijada)=>{console.error('Servis nije implementiran')},
        getBySifra:async (sifra)=>({data:{}}),
        promjeni:async (sifra,fishijada)=>{console.error('Servis nije implementiran')},
        obrisi:async (sifra)=>{console.error('Servis nije implementiran')},

}

const AktivniServis=Servis||PrazanServis










export default{
        get:()=>AktivniServis.get(),
        dodaj:(fishijada)=>AktivniServis.dodaj(fishijada),
        getBySifra:(sifra)=>AktivniServis.getBySifra(sifra),
        promjeni:(sifra,fishijada)=>AktivniServis.promjeni(sifra,fishijada),
        obrisi:(sifra)=>AktivniServis.obrisi(sifra),
}