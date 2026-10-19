import { prijave } from "./PrijavaPodaci";

// 1/4 od CRUD: Read   - omogucujemo citanje podataka i prikaz na samoj stranici

// napravimo funkciju 

async function get(){   // get je blijed jer nema onaj export default
    return {data: [...prijave]} // [...] stvara novi niz sa istim podacima    
}
 // pricamo sa udaljenim racunalom i ne znamo koliko ce odziv trajati i sve funkcije trebaju biti async
async function getBySifra(sifra){
    return {data: prijave.find(s => s.sifra === parseInt(sifra))}
}



 async function dodaj(Prijava){
    if(prijave.length===0){
        Prijava.sifra=1
    }else{
        Prijava.sifra=prijave[prijave.length-1].sifra+1
    }
    prijave.push(Prijava)
}

async function promjeni(sifra, izmjenjenaPrijava) {
    const index = prijave.findIndex(s => s.sifra === parseInt(sifra));
    if (index !== -1) {
        prijave[index] = { 
            ...prijave[index],
            ...izmjenjenaPrijava, 
            sifra: parseInt(sifra) 
        };
    }
    return { data: prijave[index] };
}

async function obrisi(sifra) {
    const index=prijave.findIndex(s=>s.sifra===parseInt(sifra))
    prijave.splice(index,1)
    
}

export default{
        get,
        dodaj,
        getBySifra,
        promjeni,
        obrisi,
}
