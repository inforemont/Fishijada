import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc, query, where, limit } from "firebase/firestore"
import getFirebaseDB from "../firebase/firebase"
import bcrypt from 'bcryptjs'

const COLLECTION_NAME = 'korisnici'

async function get() {
    try {
        const snapshot = await getDocs(collection(getFirebaseDB(), COLLECTION_NAME));
        const data = snapshot.docs.map(doc => {
            const korisnik = doc.data();
            return {
                sifra: doc.id,
                email: korisnik.email,
                uloga: korisnik.uloga,
                ime: korisnik.ime || '',
                prezime: korisnik.prezime || ''
            }
        })
        return { success: true, data: data };
    } catch (e) {
        console.error("Greška kod dohvaćanja korisnika: ", e);
        return { success: false, data: [], message: e.message };
    }
}

async function getBySifra(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), COLLECTION_NAME, sifra);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
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
        const hashiranaLozinka = bcrypt.hashSync(korisnik.lozinka, 10);
        const noviKorisnik = {
            email: korisnik.email,
            uloga: korisnik.uloga || 'Korisnik',
            lozinka: hashiranaLozinka,
            ime: korisnik.ime || '',
            prezime: korisnik.prezime || ''
        }
        const docRef = await addDoc(collection(getFirebaseDB(), COLLECTION_NAME), noviKorisnik);
        return {
            success: true,
            data: { sifra: docRef.id, ...noviKorisnik }
        }
    } catch (e) {
        return { success: false, message: e.message }
    }
}

async function promjeni(sifra, korisnik) {
    try {
        const docRef = doc(getFirebaseDB(), COLLECTION_NAME, sifra);
        const podaciZaAzuriranje = {
            email: korisnik.email,
            uloga: korisnik.uloga,
            ime: korisnik.ime || '',
            prezime: korisnik.prezime || ''
        };
        
        if (korisnik.lozinka) {
            podaciZaAzuriranje.lozinka = bcrypt.hashSync(korisnik.lozinka, 10)
        }

        await updateDoc(docRef, podaciZaAzuriranje);
        return { success: true, data: { sifra, ...podaciZaAzuriranje } }
    } catch (e) {
        return { success: false, message: e.message }
    }
}

async function obrisi(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), COLLECTION_NAME, sifra)
        await deleteDoc(docRef);
        return { success: true, message: "Korisnik obrisan" }
    } catch (e) {
        return { success: false, message: e.message }
    }
}

async function prijava(email, lozinka) {
    try {
        const q = query(collection(getFirebaseDB(), COLLECTION_NAME), where("email", "==", email), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            throw new Error("Neispravan e-mail ili lozinka.")
        }

        const korisnikDoc = querySnapshot.docs[0];
        const korisnikPodaci = korisnikDoc.data();
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

