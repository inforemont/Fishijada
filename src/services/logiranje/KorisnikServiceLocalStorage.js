import bcrypt from 'bcryptjs'

const STORAGE_KEY = 'korisnici'

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)
    if (!podaci) {
        const pocetni = [
            {
                sifra: 1,
                email: 'admin@fishijada.hr',
                lozinka: bcrypt.hashSync('Fishijada123!', 13),
                uloga: 'Admin',
                ime: 'Glavni',
                prezime: 'Admin'
            },
            {
                sifra: 2,
                email: 'korisnik@fishijada.hr',
                lozinka: bcrypt.hashSync('Fishijada123!', 13),
                uloga: 'Korisnik',
                ime: 'Pero',
                prezime: 'Perić'
            }
        ]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pocetni))
        return pocetni
    }
    return JSON.parse(podaci)
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get() {
    const korisnici = dohvatiSveIzStorage()
    const bezLozinki = korisnici.map(k => ({
        sifra: k.sifra,
        email: k.email,
        uloga: k.uloga,
        ime: k.ime,
        prezime: k.prezime
    }))
    return { data: bezLozinki }
}

async function getBySifra(sifra) {
    const korisnici = dohvatiSveIzStorage()
    const korisnik = korisnici.find(o => o.sifra === parseInt(sifra))
    return { data: korisnik ? { sifra: korisnik.sifra, email: korisnik.email, uloga: korisnik.uloga, ime: korisnik.ime, prezime: korisnik.prezime } : null }
}

async function dodaj(korisnik) {
    const korisnici = dohvatiSveIzStorage()
    
    if (korisnici.length === 0) {
        korisnik.sifra = 1
    } else {
        const maxSifra = Math.max(...korisnici.map(s => s.sifra))
        korisnik.sifra = maxSifra + 1
    }
    
    if (korisnik.lozinka) {
        korisnik.lozinka = bcrypt.hashSync(korisnik.lozinka, 10)
    }
    
    korisnik.uloga = korisnik.uloga || 'Korisnik'
    
    korisnici.push(korisnik)
    spremiUStorage(korisnici)
    return { data: korisnik }
}

async function promjeni(sifra, izmijenjeniKorisnik) {
    const korisnici = dohvatiSveIzStorage()
    const index = korisnici.findIndex(o => o.sifra === parseInt(sifra))
    
    if (index !== -1) {
        korisnici[index] = {
            ...korisnici[index],
            ...izmijenjeniKorisnik,
            sifra: parseInt(sifra)
        }

        if (izmijenjeniKorisnik.lozinka) {
            korisnici[index].lozinka = bcrypt.hashSync(izmijenjeniKorisnik.lozinka, 10)
        }
        spremiUStorage(korisnici)
    }
    return { data: korisnici[index] }
}

async function obrisi(sifra) {
    let korisnici = dohvatiSveIzStorage()
    korisnici = korisnici.filter(o => o.sifra !== parseInt(sifra))
    spremiUStorage(korisnici)
    return { data: true }
}

async function prijava(email, lozinka) {
    const korisnici = dohvatiSveIzStorage()
    const korisnik = korisnici.find(o => o.email === email)
    
    if (!korisnik) {
        throw new Error("Neispravan e-mail ili lozinka.")
    }
    
    const isMatch = bcrypt.compareSync(lozinka, korisnik.lozinka)
    if (!isMatch) {
        throw new Error("Neispravan e-mail ili lozinka.")
    }
    
    return {
        sifra: korisnik.sifra,
        email: korisnik.email,
        uloga: korisnik.uloga,
        ime: korisnik.ime,
        prezime: korisnik.prezime
    }
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
    prijava
}