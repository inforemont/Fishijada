const STORAGE_KEY='prijave'

function dohvatSveIzStorage(){
    const podaci=localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci) : []
}


function spremiUStorage(podaci){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get(){   
    const prijave=dohvatSveIzStorage()
    return{data:[prijave]}
}

async function getBySifra(sifra){
    const prijave=dohvatSveIzStorage()
    return {data: prijave.find(s => s.sifra === parseInt(sifra))}
}




 async function dodaj(prijava){
    const prijave=dohvatSveIzStorage
    if(prijave.length===0){
        prijava.sifra=1
    }else{
        const maxSifra =Math.max(...prijave.map(s=>s.sifra))
        prijava.sifra=maxSifra+1
    }
    prijave.push(prijava)
    spremiUStorage(prijave)
}

async function promjeni(sifra, prijava) {
    const prijave=dohvatSveIzStorage()
    const index=prijave.findIndex(s=>s.sifra===parseInt(sifra))
    prijave[index]={...prijave[index],...prijava}
    spremiUStorage(prijave)

}

async function obrisi(sifra) {
    let prijave=dohvatSveIzStorage()
    prijave=prijave.filter(s=>s.sifra!==parseInt(sifra))
    spremiUStorage(prijave)
    
}

export default{
        get,
        dodaj,
        getBySifra,
        promjeni,
        obrisi,
}
