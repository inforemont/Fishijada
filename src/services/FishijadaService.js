import { fishijade } from "./FishijadaPodaci";

// 1/4 od CRUD: Read   - omogucujemo citanje podataka i prikaz na samoj stranici

// napravimo funkciju 

async function get(){   // get je blijed jer nema onaj export default
    return {data: [...fishijade]} // [...] stvara novi niz sa istim podacima    
}
 // pricamo sa udaljenim racunalom i ne znamo koliko ce odziv trajati i sve funkcije trebaju biti async
async function getBySifra(sifra){
    return {data: fishijade.find(s => s.sifra === parseInt(sifra))}
}



 async function dodaj(fishijada){
    if(fishijade.length===0){
        fishijada.sifra=1
    }else{
        fishijada.sifra=fishijade[fishijade.length-1].sifra+1
    }
    fishijade.push(fishijada)
}

async function promjeni(sifra, izmjenjenaFishijada) {
    const index = fishijade.findIndex(s => s.sifra === parseInt(sifra));
    if (index !== -1) {
        fishijade[index] = { 
            ...fishijade[index],
            ...izmjenjenaFishijada, 
            sifra: parseInt(sifra) 
        };
    }
    return { data: fishijade[index] };
}

export default{
        get,
        dodaj,
        getBySifra,
        promjeni,
}
