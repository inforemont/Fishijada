import LokacijaServiceMemorija from "./LokacijaServiceMemorija"
import { DATA_SOURCE } from "../../constants"
import LokacijaServiceLocalStorage from "./LokacijaServiceLocalStorage"

let Servis = null
switch(DATA_SOURCE){
    case 'memorija':
        Servis= LokacijaServiceMemorija
        break
    case 'localStorage':
        Servis=LokacijaServiceLocalStorage
        break
    default:
        Servis=null
}

const PrazanServis = {
        get:async ()=>({data:[]}),
        dodaj: async (Lokacija)=>{console.error('Servis nije implementiran')},
        getBySifra:async (sifra)=>({data:{}}),
        promjeni:async (sifra,Lokacija)=>{console.error('Servis nije implementiran')},
        obrisi:async (sifra)=>{console.error('Servis nije implementiran')},

}

const AktivniServis=Servis||PrazanServis










export default{
        get:()=>AktivniServis.get(),
        dodaj:(Lokacija)=>AktivniServis.dodaj(Lokacija),
        getBySifra:(sifra)=>AktivniServis.getBySifra(sifra),
        promjeni:(sifra,Lokacija)=>AktivniServis.promjeni(sifra,Lokacija),
        obrisi:(sifra)=>AktivniServis.obrisi(sifra),
}