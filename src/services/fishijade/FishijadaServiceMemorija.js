import { fishijade } from "./../fishijade/FishijadaPodaci"


async function get() {
    return { data: [...fishijade] }
}
async function getBySifra(sifra) {
    return { data: fishijade.find(s => s.sifra === parseInt(sifra)) }
}



async function dodaj(fishijada) {
    if (fishijade.length === 0) {
        fishijada.sifra = 1
    } else {
        fishijada.sifra = fishijade[fishijade.length - 1].sifra + 1
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

async function obrisi(sifra) {
    const index = fishijade.findIndex(s => s.sifra === parseInt(sifra))
    fishijade.splice(index, 1)

}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
}
