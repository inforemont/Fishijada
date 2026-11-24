import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore"
import getFirebaseDB from "../firebase/firebase"

const COLLECTION_NAME = 'prijave'

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
        console.error("Greška kod dohvaćanja prijava: ", e)
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

async function dodaj(prijava) {
    try {
        const docRef = await addDoc(collection(getFirebaseDB(), COLLECTION_NAME), prijava)
        return {
            success: true,
            data: { sifra: docRef.id, ...prijava }
        }
    } catch (e) {
        return { success: false, message: e.message }
    }
}

async function promjeni(sifra, prijava) {
    try {
        const docRef = doc(getFirebaseDB(), COLLECTION_NAME, String(sifra))
        const { sifra: _, ...podaciZaAzuriranje } = prijava
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
        return { success: true, message: "Prijava obrisana" }
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