import PrijavaServiceMemorija from "./PrijavaServiceMemorija"
import { DATA_SOURCE } from "../../constants"
import PrijavaServiceLocalStorage from "./PrijavaServiceLocalStorage"

let Servis = null
switch(DATA_SOURCE){
    case 'memorija':
        Servis= PrijavaServiceMemorija
        break
    case 'localStorage':
        Servis=PrijavaServiceLocalStorage
        break
    default:
        Servis=null
}

const PrazanServis = {
        get:async ()=>({data:[]}),
        dodaj: async (Prijava)=>{console.error('Servis nije implementiran')},
        getBySifra:async (sifra)=>({data:{}}),
        promjeni:async (sifra,Prijava)=>{console.error('Servis nije implementiran')},
        obrisi:async (sifra)=>{console.error('Servis nije implementiran')},

}

const AktivniServis=Servis||PrazanServis










export default{
        get:()=>AktivniServis.get(),
        dodaj:(Prijava)=>AktivniServis.dodaj(Prijava),
        getBySifra:(sifra)=>AktivniServis.getBySifra(sifra),
        promjeni:(sifra,Prijava)=>AktivniServis.promjeni(sifra,Prijava),
        obrisi:(sifra)=>AktivniServis.obrisi(sifra),
}