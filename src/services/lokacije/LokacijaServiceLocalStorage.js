const STORAGE_KEY='lokacije'

function dohvatSveIzStorage(){
    const podaci=localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci) : []
}


function spremiUStorage(podaci){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get(){   
    const lokacije=dohvatSveIzStorage()
    return{data:lokacije}
}

async function getBySifra(sifra){
    const lokacije=dohvatSveIzStorage()
    return {data: lokacije.find(s => s.sifra === parseInt(sifra))}
}




 async function dodaj(lokacija){
    const lokacije=dohvatSveIzStorage ()
    if(lokacije.length===0){
        lokacija.sifra=1
    }else{
        const maxSifra =Math.max(...lokacije.map(s=>s.sifra))
        lokacija.sifra=maxSifra+1
    }
    lokacije.push(lokacija)
    spremiUStorage(lokacije)
}

async function promjeni(sifra, lokacija) {
    const lokacije=dohvatSveIzStorage()
    const index=lokacije.findIndex(s=>s.sifra===parseInt(sifra))
    lokacije[index]={...lokacije[index],...lokacija}
    spremiUStorage(lokacije)

}

async function obrisi(sifra) {
    let lokacije=dohvatSveIzStorage()
    lokacije=lokacije.filter(s=>s.sifra!==parseInt(sifra))
    spremiUStorage(lokacije)
    
}

export default{
        get,
        dodaj,
        getBySifra,
        promjeni,
        obrisi,
}
