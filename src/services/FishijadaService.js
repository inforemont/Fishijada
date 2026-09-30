import { fishijade } from "./FishijadaPodaci";

// 1/4 od CRUD: Read   - omogucujemo citanje podataka i prikaz na samoj stranici

// napravimo funkciju 

async function get(){   // get je blijed jer nema onaj export default
    return {data: [...fishijade]} // [...] stvara novi niz sa istim podacima    
} // pricamo sa udaljenim racunalom i ne znamo koliko ce odziv trajati i sve funkcije trebaju biti async
async function dodaj(fishijada){
    if(fishijade.length===0){
        fishijada.sifra=1
    }else{
        fishijada.sifra=fishijade[fishijade.length-1].sifra+1
    }
    fishijade.push(fishijada)
}

export default{
        get,
        dodaj
}
