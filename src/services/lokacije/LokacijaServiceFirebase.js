import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore"
import getFirebaseDB from "../firebase/firebase"

const COLLECTION_NAME = 'lokacije'

async function get() {
    try {
        const snapshot = await getDocs(collection(getFirebaseDB(), COLLECTION_NAME))
        const data = snapshot.docs.map(docSnap => {
            const podaci = docSnap.data()
            return {
                sifra: docSnap.id,
                ...podaci
            }
        })
        return { success: true, data }
    } catch (e) {
        console.error("Greška kod dohvaćanja lokacija: ", e)
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
                    ...data
                }
            }
        }
        return { success: false, data: null }
    } catch (e) {
        return { success: false, data: null, message: e.message }
    }
}

async function dodaj(lokacija) {
    try {
        const docRef = await addDoc(collection(getFirebaseDB(), COLLECTION_NAME), lokacija)
        return {
            success: true,
            data: { sifra: docRef.id, ...lokacija }
        }
    } catch (e) {
        return { success: false, message: e.message }
    }
}

async function promjeni(sifra, lokacija) {
    try {
        const docRef = doc(getFirebaseDB(), COLLECTION_NAME, String(sifra))
        const { sifra: _, ...podaciZaAzuriranje } = lokacija
        await updateDoc(docRef, podaciZaAzuriranje)
        return { success: true, data: { sifra, ...podaciZaAzuriranje } }
    } catch (e) {
        return { success: false, message: e.message }
    }
}

async function obrisi(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), COLLECTION_NAME, String(sifra))
        await deleteDoc(docRef)
        return { success: true, message: "Lokacija obrisana" }
    } catch (e) {
        return { success: false, message: e.message }
    }
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
}