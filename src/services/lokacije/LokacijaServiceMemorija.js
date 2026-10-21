import { lokacije } from "./LokacijaPodaci";

// 1/4 od CRUD: Read   - omogucujemo citanje podataka i prikaz na samoj stranici

// napravimo funkciju 

async function get(){   // get je blijed jer nema onaj export default
    return {data: [...lokacije]} // [...] stvara novi niz sa istim podacima    
}
 // pricamo sa udaljenim racunalom i ne znamo koliko ce odziv trajati i sve funkcije trebaju biti async
async function getBySifra(sifra){
    return {data: lokacije.find(s => s.sifra === parseInt(sifra))}
}



 async function dodaj(Lokacija){
    if(lokacije.length===0){
        Lokacija.sifra=1
    }else{
        Lokacija.sifra=lokacije[lokacije.length-1].sifra+1
    }
    lokacije.push(Lokacija)
}

async function promjeni(sifra, izmjenjenaLokacija) {
    const index = lokacije.findIndex(s => s.sifra === parseInt(sifra));
    if (index !== -1) {
        lokacije[index] = { 
            ...lokacije[index],
            ...izmjenjenaLokacija, 
            sifra: parseInt(sifra) 
        };
    }
    return { data: lokacije[index] };
}

async function obrisi(sifra) {
    const index=lokacije.findIndex(s=>s.sifra===parseInt(sifra))
    lokacije.splice(index,1)
    
}

export default{
        get,
        dodaj,
        getBySifra,
        promjeni,
        obrisi,
}
