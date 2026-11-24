import bcrypt from 'bcryptjs'

let korisnici = [
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

async function get() {
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
    const korisnik = korisnici.find(o => o.sifra === parseInt(sifra))
    return { 
        data: korisnik ? { 
            sifra: korisnik.sifra, 
            email: korisnik.email, 
            uloga: korisnik.uloga, 
            ime: korisnik.ime, 
            prezime: korisnik.prezime 
        } : null 
    }
}

async function dodaj(korisnik) {
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
    return { data: korisnik }
}

async function promjeni(sifra, izmijenjeniKorisnik) {
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
    }
    return { data: korisnici[index] }
}

async function obrisi(sifra) {
    korisnici = korisnici.filter(o => o.sifra !== parseInt(sifra))
    return { data: true }
}

async function prijava(email, lozinka) {
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