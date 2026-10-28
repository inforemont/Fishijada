const STORAGE_KEY='fishijade'

function dohvatSveIzStorage(){
    const podaci=localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci) : []
}

// 1/4 od CRUD: Read   - omogucujemo citanje podataka i prikaz na samoj stranici

// napravimo funkciju 

function spremiUStorage(podaci){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get(){   // get je blijed jer nema onaj export default
    const fishijade=dohvatSveIzStorage()
    return{data:fishijade}
}

async function getBySifra(sifra){
    const fishijade=dohvatSveIzStorage()
    return {data: fishijade.find(s => s.sifra === parseInt(sifra))}
}




 async function dodaj(fishijada){
    const fishijade=dohvatSveIzStorage()
    if(fishijade.length===0){
        fishijada.sifra=1
    }else{
        const maxSifra =Math.max(...fishijade.map(s=>s.sifra))
        fishijada.sifra=maxSifra+1
    }
    fishijade.push(fishijada)
    spremiUStorage(fishijade)
}

async function promjeni(sifra, fishijada) {
    const fishijade=dohvatSveIzStorage()
    const index=fishijade.findIndex(s=>s.sifra===parseInt(sifra))
    fishijade[index]={...fishijade[index],...fishijada}
    spremiUStorage(fishijade)

}

async function obrisi(sifra) {
    let fishijade=dohvatSveIzStorage()
    fishijade=fishijade.filter(s=>s.sifra!==parseInt(sifra))
    spremiUStorage(fishijade)
    
}

export default{
        get,
        dodaj,
        getBySifra,
        promjeni,
        obrisi,
}
