import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc, query, where, limit } from "firebase/firestore"
import getFirebaseDB from "../firebase/firebase"
import bcrypt from 'bcryptjs'

const COLLECTION_NAME = 'korisnici'

async function provjeriIStvoriAdmina() {
    try {
        const db = getFirebaseDB();
        const q = query(collection(db, COLLECTION_NAME), where("email", "==", "admin@fishijada.hr"), limit(1));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            const adminKorisnik = {
                email: 'admin@fishijada.hr',
                lozinka: bcrypt.hashSync('Fishijada123!', 10),
                uloga: 'Admin',
                ime: 'Glavni',
                prezime: 'Admin'
            };
            await addDoc(collection(db, COLLECTION_NAME), adminKorisnik);
            console.log("Početni admin uspješno dodan u Firebase!");
        }
    } catch (e) {
        console.error("Greška kod provjere/stvaranja admina na Firebaseu: ", e);
    }
}

async function inicijalizirajPocetneKorisnike() {
    try {
        await provjeriIStvoriAdmina();
        const db = getFirebaseDB();
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        
        if (snapshot.empty) {
            const pocetniKorisnici = [
                {
                    email: 'admin@fishijada.hr',
                    lozinka: bcrypt.hashSync('Fishijada123!', 10),
                    uloga: 'Admin',
                    ime: 'Glavni',
                    prezime: 'Admin'
                },
                {
                    email: 'korisnik@fishijada.hr',
                    lozinka: bcrypt.hashSync('Fishijada123!', 10),
                    uloga: 'Korisnik',
                    ime: 'Pero',
                    prezime: 'Perić'
                }
            ]

            for (const k of pocetniKorisnici) {
                await addDoc(collection(db, COLLECTION_NAME), k)
            }
            console.log("Inicijalni korisnici uspješno dodani u Firebase!")
        }
    } catch (e) {
        console.error("Greška kod inicijalizacije početnih korisnika na Firebaseu: ", e)
    }
}

async function get() {
    try {
        await inicijalizirajPocetneKorisnike()
        const snapshot = await getDocs(collection(getFirebaseDB(), COLLECTION_NAME))
        const data = snapshot.docs.map(docSnap => {
            const korisnik = docSnap.data()
            return {
                sifra: docSnap.id,
                email: korisnik.email,
                uloga: korisnik.uloga,
                ime: korisnik.ime || '',
                prezime: korisnik.prezime || ''
            }
        })
        return { success: true, data: data }
    } catch (e) {
        console.error("Greška kod dohvaćanja korisnika: ", e)
        return { success: false, data: [], message: e.message }
    }
}

async function getBySifra(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), COLLECTION_NAME, String(sifra))
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
            const data = docSnap.data()
            return {
                success: true,
                data: {
                    sifra: docSnap.id,
                    email: data.email,
                    uloga: data.uloga,
                    ime: data.ime || '',
                    prezime: data.prezime || ''
                }
            }
        }
        return { success: false, data: null }
    } catch (e) {
        return { success: false, data: null, message: e.message }
    }
}

async function dodaj(korisnik) {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(korisnik.lozinka || 'Fishijada123!', salt)

        const noviKorisnik = {
            email: korisnik.email,
            uloga: korisnik.uloga || 'Korisnik',
            lozinka: hashedPassword, 
            ime: korisnik.ime || '',
            prezime: korisnik.prezime || ''
        }
        const docRef = await addDoc(collection(getFirebaseDB(), COLLECTION_NAME), noviKorisnik)
        return {
            success: true,
            data: { sifra: docRef.id, email: noviKorisnik.email, uloga: noviKorisnik.uloga, ime: noviKorisnik.ime, prezime: noviKorisnik.prezime }
        }
    } catch (e) {
        console.error("Greška kod dodavanja korisnika u Firebase: ", e)
        return { success: false, message: e.message }
    }
}

async function promjeni(sifra, korisnik) {
    try {
        const docRef = doc(getFirebaseDB(), COLLECTION_NAME, String(sifra));
        const podaciZaAzuriranje = {
            email: korisnik.email,
            uloga: korisnik.uloga,
            ime: korisnik.ime || '',
            prezime: korisnik.prezime || ''
        }
        
        if (korisnik.lozinka) {
            const salt = bcrypt.genSaltSync(10)
            podaciZaAzuriranje.lozinka = bcrypt.hashSync(korisnik.lozinka, salt)
        }

        await updateDoc(docRef, podaciZaAzuriranje);
        return { success: true, data: { sifra, ...podaciZaAzuriranje } }
    } catch (e) {
        return { success: false, message: e.message }
    }
}

async function obrisi(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), COLLECTION_NAME, String(sifra))
        await deleteDoc(docRef);
        return { success: true, message: "Korisnik obrisan" }
    } catch (e) {
        return { success: false, message: e.message }
    }
}

async function prijava(email, lozinka) {
    try {
        await inicijalizirajPocetneKorisnike()
        const q = query(collection(getFirebaseDB(), COLLECTION_NAME), where("email", "==", email), limit(1))
        const querySnapshot = await getDocs(q)
        
        if (querySnapshot.empty) {
            throw new Error("Neispravan e-mail ili lozinka.")
        }

        const korisnikDoc = querySnapshot.docs[0]
        const korisnikPodaci = korisnikDoc.data()

        const isMatch = bcrypt.compareSync(lozinka, korisnikPodaci.lozinka)
        
        if (!isMatch) {
            throw new Error("Neispravan e-mail ili lozinka.")
        }

        return {
            sifra: korisnikDoc.id,
            email: korisnikPodaci.email,
            uloga: korisnikPodaci.uloga,
            ime: korisnikPodaci.ime || '',
            prezime: korisnikPodaci.prezime || ''
        };
    } catch (e) {
        throw new Error(e.message || "Greška kod prijave.")
    }
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
    prijava,
}