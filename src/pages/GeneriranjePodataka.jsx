import { useState, useEffect } from 'react';
import { Button, Form, Alert, Container, Row, Col, Badge, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Faker, hr } from '@faker-js/faker';
import FishijadaService from '../services/fishijade/FishijadaService';
import PrijavaService from '../services/prijave/PrijavaService';
import LokacijaService from '../services/lokacije/LokacijaService';
import KorisnikService from '../services/logiranje/KorisnikService';
import { DATA_SOURCE, RouteNames } from '../constants'; 

export default function GeneriranjePodataka() {
    const navigate = useNavigate();

    useEffect(() => {
        const spremljeniKorisnik = localStorage.getItem("prijavljeniKorisnik");
        if (!spremljeniKorisnik) {
            navigate(RouteNames.LOGIN);
            return;
        }
        const korisnik = JSON.parse(spremljeniKorisnik);
        if (korisnik.uloga !== "Admin") {
            navigate(RouteNames.HOME);
        }
    }, [navigate]);

    const [trenutniIzvor, setTrenutniIzvor] = useState(() => {
        return localStorage.getItem("odabraniIzvorPodataka") || DATA_SOURCE;
    });

    const [brojFishijada, setBrojFishijada] = useState(8)
    const [brojPrijava, setBrojPrijava] = useState(30)
    const [brojLokacija, setBrojLokacija] = useState(10)
    const [brojKorisnika, setBrojKorisnika] = useState(5)
    const [poruka, setPoruka] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingTekst, setLoadingTekst] = useState('')

    const [showModal, setShowModal] = useState(false)
    const [modalConfig, setModalConfig] = useState({ naslov: '', tekst: '', akcija: null })

    useEffect(() => {
        if (poruka) {
            const timer = setTimeout(() => {
                setPoruka(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [poruka]);

    const faker = new Faker({
        locale: [hr]
    })

    const provjeriAdminOvlasti = () => {
        const spremljeniKorisnik = localStorage.getItem("prijavljeniKorisnik");
        if (!spremljeniKorisnik) {
            navigate(RouteNames.LOGIN);
            return false;
        }
        const korisnik = JSON.parse(spremljeniKorisnik);
        if (korisnik.uloga !== "Admin") {
            setPoruka({ tip: 'danger', tekst: 'Nemate ovlasti za generiranje podataka!' });
            return false;
        }
        return true;
    }

   const generirajRandomSlike = () => {
    const brojSlika = faker.number.int({ min: 3, max: 8 });
    const slike = [];
    
    for (let i = 0; i < brojSlika; i++) {
        const randomBroj = faker.number.int({ min: 1, max: 51 });
        slike.push(String(randomBroj)); // Sprema npr. "15"
    }
    return slike;
}

    const promjeniIzvorPodataka = () => {
        let noviIzvor
        if (trenutniIzvor === 'localStorage') {
            noviIzvor = 'firebase'
        } else if (trenutniIzvor === 'firebase') {
            noviIzvor = 'memorija'
        } else {
            noviIzvor = 'localStorage'
        }
        
        setTrenutniIzvor(noviIzvor)
        localStorage.setItem("odabraniIzvorPodataka", noviIzvor);
        
        setPoruka({
            tip: 'info',
            tekst: `Izvor podataka uspješno promijenjen na: ${noviIzvor}`
        })
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    const generirajFishijade = async (broj) => {
        if (!provjeriAdminOvlasti()) return;
        const rezultatLokacija = await LokacijaService.get()
        const lokacije = rezultatLokacija.data || []
        const rezultatPrijava = await PrijavaService.get()
        const prijave = rezultatPrijava.data || []

        // Definirane dozvoljene cjelobrojne vrijednosti kotizacije
        const dozvoljeneCijene = [40, 45, 50, 55, 60, 65, 70, 75, 80];

        for (let i = 0; i < broj; i++) {
            let randomLokacijeSifre = []
            let prijavePoLokacijama = {}

            if (lokacije.length > 0) {
                const brojZaOdabrati = faker.number.int({ min: 1, max: Math.min(10, lokacije.length) })
                const odabraneLokacije = faker.helpers.arrayElements(lokacije, brojZaOdabrati)
                randomLokacijeSifre = odabraneLokacije.map(l => l.sifra)

                if (prijave.length > 0) {
                    odabraneLokacije.forEach(lokacija => {
                        const brojPrijavaZaOvuLokaciju = faker.number.int({ min: 1, max: Math.min(50, prijave.length) });
                        const prijaveZaOvuLokaciju = prijave.filter(p => String(p.lokacija) === String(lokacija.sifra) || String(p.lokacijaId) === String(lokacija.sifra));
                        
                        const odabranePrijaveZaLokaciju = prijaveZaOvuLokaciju.length > 0 
                            ? faker.helpers.arrayElements(prijaveZaOvuLokaciju, Math.min(brojPrijavaZaOvuLokaciju, prijaveZaOvuLokaciju.length))
                            : faker.helpers.arrayElements(prijave, Math.min(brojPrijavaZaOvuLokaciju, prijave.length));

                        prijavePoLokacijama[lokacija.sifra] = odabranePrijaveZaLokaciju.map(p => p.sifra);
                    })
                }
            }

            const fishijada = {
                naziv: `Prvenstvo Baranje ${2020 + i}`,
                mjestoOdrzavanja: 'Beli Manastir',
                cijena: faker.helpers.arrayElement(dozvoljeneCijene), // Odabire jednu od zadanih vrijednosti
                datumPokretanja: new Date(2020 + i, 4, 15).toISOString(),
                aktivan: i === 0,
                lokacije: randomLokacijeSifre,
                prijavePoLokacijama: prijavePoLokacijama
            }

            await FishijadaService.dodaj(fishijada)
        }
    }


    const generirajPrijave = async (broj) => {
        if (!provjeriAdminOvlasti()) return;
        let rezultatLokacija = await LokacijaService.get()
        let lokacije = rezultatLokacija.data || []

        if (lokacije.length === 0) {
            throw new Error("Nema pronađenih lokacija u bazi. Prvo generirajte lokacije!");
        }

        for (let j = 0; j < broj; j++) {
            const nasumicnaLokacija = faker.helpers.arrayElement(lokacije);
            const prijava = {
                imePrezime: faker.person.firstName() + ' ' + faker.person.lastName(),
                ekipa: 'Ekipa ' + faker.person.lastName() + ' ' + faker.number.int({ min: 1, max: 100 }),
                stol: faker.number.int({ min: 1, max: 150 }),
                email: faker.internet.email(),
                kotizacijaPlacena: faker.datatype.boolean(),
                prvenstvoHrvatske: false,
                lokacija: nasumicnaLokacija.sifra,
                lokacijaId: nasumicnaLokacija.sifra,
                slike: generirajRandomSlike()
            }
            await PrijavaService.dodaj(prijava);
        }
    }

    const napuniPostojecePrijaveSlikama = async () => {
        if (!provjeriAdminOvlasti()) return;
        setLoading(true)
        setLoadingTekst('Punjenje postojećih prijava lokalnim slikama...')
        setPoruka(null)

        try {
            const rezultat = await PrijavaService.get();
            const prijave = rezultat.data || [];

            if (prijave.length === 0) {
                setPoruka({ tip: 'warning', tekst: 'Nema pronađenih prijava u bazi koje bi se napunile slikama!' })
                setLoading(false)
                return
            }

            let brojac = 0;
            for (const prijava of prijave) {
                const izmjenjenaPrijava = { ...prijava, slike: generirajRandomSlike() };
                await PrijavaService.promjeni(prijava.sifra, izmjenjenaPrijava);
                brojac++;
            }

            setPoruka({ tip: 'success', tekst: `Uspješno dodane lokalne slike u galerije za ${brojac} postojećih prijava!` })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri punjenju slika: ' + error.message })
        } finally {
            setLoading(false)
            setLoadingTekst('')
        }
    }

    const generirajLokacije = async (broj) => {
        if (!provjeriAdminOvlasti()) return;
        const naziviLokacija = [
            'Kneževi Vinogradi', 'Luč', 'Jagodnjak', 'Baranjsko Petrovo Selo',
            'Petlovac', 'Lug', 'Kopačevo', 'Zmajevac', 'Batina', 'Darda'
        ]

        for (let i = 0; i < broj; i++) {
            await LokacijaService.dodaj({
                mjesto: naziviLokacija[i % naziviLokacija.length] + (i >= naziviLokacija.length ? ` ${Math.floor(i / naziviLokacija.length) + 1}` : ''),
                zupanija: 'Osječko-baranjska',
                posta: faker.string.numeric(5),
                datumOdrzavanja: faker.date.soon().toISOString().split('T')[0]
            })
        }
    }

    const generirajKorisnike = async (broj) => {
        if (!provjeriAdminOvlasti()) return;
        for (let i = 0; i < broj; i++) {
            const ime = faker.person.firstName()
            const prezime = faker.person.lastName()
            const korisnik = {
                ime: ime,
                prezime: prezime,
                email: faker.internet.email({ firstName: ime, lastName: prezime }).toLowerCase(),
                lozinka: 'Fishijada123!',
                uloga: 'Korisnik'
            }
            await KorisnikService.dodaj(korisnik)
        }
    }

    const handleGenerirajFishijade = async (e) => {
        e.preventDefault()
        if (!provjeriAdminOvlasti()) return;
        setLoading(true)
        setLoadingTekst('Generiranje fišijada u tijeku...')
        setPoruka(null)

        try {
            const provjeraLokacija = await LokacijaService.get()
            if (!provjeraLokacija.data || provjeraLokacija.data.length === 0) {
                setPoruka({ tip: 'warning', tekst: 'Prvo morate generirati lokacije prije generiranja fišijada!' })
                setLoading(false)
                return
            }

            const provjeraPrijava = await PrijavaService.get()
            if (!provjeraPrijava.data || provjeraPrijava.data.length === 0) {
                setPoruka({ tip: 'warning', tekst: 'Prvo morate generirati prijave prije generiranja fišijada!' })
                setLoading(false)
                return
            }

            await generirajFishijade(brojFishijada)
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojFishijada} fišijada!` })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju fišijada: ' + error.message })
        } finally {
            setLoading(false)
            setLoadingTekst('')
        }
    };

    const handleGenerirajPrijave = async (e) => {
        e.preventDefault()
        if (!provjeriAdminOvlasti()) return;
        setLoading(true)
        setLoadingTekst('Generiranje prijava s lokalnim slikama...')
        setPoruka(null)

        try {
            const provjeraLokacija = await LokacijaService.get()
            if (!provjeraLokacija.data || provjeraLokacija.data.length === 0) {
                setPoruka({ tip: 'warning', tekst: 'Prvo morate generirati lokacije prije generiranja prijava!' })
                setLoading(false)
                return
            }

            await generirajPrijave(brojPrijava)
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojPrijava} prijava s lokalnom galerijom slika!` })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju prijava: ' + error.message })
        } finally {
            setLoading(false)
            setLoadingTekst('')
        }
    }

    const handleGenerirajLokacije = async (e) => {
        e.preventDefault()
        if (!provjeriAdminOvlasti()) return;
        setLoading(true)
        setLoadingTekst('Generiranje lokacija u tijeku...')
        setPoruka(null)

        try {
            await generirajLokacije(brojLokacija)
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojLokacija} lokacija!` })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju lokacija: ' + error.message })
        } finally {
            setLoading(false)
            setLoadingTekst('')
        }
    }

    const handleGenerirajKorisnike = async (e) => {
        e.preventDefault()
        if (!provjeriAdminOvlasti()) return;
        setLoading(true)
        setLoadingTekst('Generiranje korisnika u tijeku...')
        setPoruka(null)

        try {
            await generirajKorisnike(brojKorisnika)
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojKorisnika} običnih korisnika!` })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju korisnika: ' + error.message })
        } finally {
            setLoading(false)
            setLoadingTekst('')
        }
    }

    const otvoriModalZaBrisanje = (vrsta) => {
        if (!provjeriAdminOvlasti()) return;

        let naslov = ''
        let tekst = ''
        let akcija = null

        if (vrsta === 'lokacije') {
            naslov = 'Brisanje lokacija'
            tekst = 'Jeste li sigurni da želite obrisati sve lokacije?'
            akcija = izvrsiBrisanjeLokacija
        } else if (vrsta === 'prijave') {
            naslov = 'Brisanje prijava'
            tekst = 'Jeste li sigurni da želite obrisati sve prijave?'
            akcija = izvrsiBrisanjePrijava
        } else if (vrsta === 'fishijade') {
            naslov = 'Brisanje fišijada'
            tekst = 'Jeste li sigurni da želite obrisati sve fišijade?'
            akcija = izvrsiBrisanjeFishijada
        } else if (vrsta === 'korisnici') {
            naslov = 'Brisanje korisnika'
            tekst = 'Jeste li sigurni da želite obrisati sve korisnike?'
            akcija = izvrsiBrisanjeKorisnika
        }

        setModalConfig({ naslov, tekst, akcija })
        setShowModal(true)
    }

    const izvrsiBrisanjePrijava = async () => {
        setShowModal(false)
        setLoading(true)
        setLoadingTekst('Brisanje prijava...')
        setPoruka(null)
        try {
            const rezultat = await PrijavaService.get()
            for (const prijava of (rezultat.data || [])) {
                await PrijavaService.obrisi(prijava.sifra)
            }
            setPoruka({ tip: 'success', tekst: 'Uspješno obrisane sve prijave!' })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju prijava: ' + error.message })
        } finally {
            setLoading(false)
            setLoadingTekst('')
        }
    }

    const izvrsiBrisanjeFishijada = async () => {
        setShowModal(false)
        setLoading(true)
        setLoadingTekst('Brisanje fišijada...')
        setPoruka(null)
        try {
            const rezultat = await FishijadaService.get();
            for (const fishijada of (rezultat.data || [])) {
                await FishijadaService.obrisi(fishijada.sifra)
            }
            setPoruka({ tip: 'success', tekst: 'Uspješno obrisane sve fišijade!' })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju fišijada: ' + error.message })
        } finally {
            setLoading(false)
            setLoadingTekst('')
        }
    }

    const izvrsiBrisanjeLokacija = async () => {
        setShowModal(false)
        setLoading(true)
        setLoadingTekst('Brisanje lokacija...')
        setPoruka(null)
        try {
            const rezultat = await LokacijaService.get()
            for (const lokacija of (rezultat.data || [])) {
                await LokacijaService.obrisi(lokacija.sifra)
            }
            setPoruka({ tip: 'success', tekst: 'Uspješno obrisane sve lokacije!' })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju lokacija: ' + error.message })
        } finally {
            setLoading(false)
            setLoadingTekst('')
        }
    }

    const izvrsiBrisanjeKorisnika = async () => {
        setShowModal(false)
        setLoading(true)
        setLoadingTekst('Brisanje korisnika...')
        setPoruka(null)
        try {
            const rezultat = await KorisnikService.get();
            for (const korisnik of (rezultat.data || [])) {
                await KorisnikService.obrisi(korisnik.sifra)
            }
            setPoruka({ tip: 'success', tekst: 'Uspješno obrisani svi korisnici!' })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju korisnika: ' + error.message })
        } finally {
            setLoading(false)
            setLoadingTekst('')
        }
    }

    return (
        <Container className="mt-4 mb-5 position-relative">
            {loading && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white bg-opacity-75"
                    style={{ zIndex: 1050 }}
                >
                    <Spinner animation="border" variant="success" style={{ width: '4rem', height: '4rem' }} />
                    <h4 className="mt-3 text-success fw-bold">{loadingTekst || 'Obrada u tijeku...'}</h4>
                    <p className="text-muted small">Molimo pričekajte, podaci se sinkroniziraju.</p>
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title className="fw-bold fs-5">⚠️ {modalConfig.naslov}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <p className="fs-6 mb-0 text-dark fw-semibold">{modalConfig.tekst}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="rounded-pill px-4">
                        Odustani
                    </Button>
                    <Button variant="danger" onClick={modalConfig.akcija} className="rounded-pill px-4 fw-bold">
                        Potvrdi brisanje
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1>Generiranje podataka</h1>
                    <p className="text-muted mb-0">
                        Alat za automatsko generiranje testnih podataka na hrvatskom jeziku.
                    </p>
                </div>
                <div className="p-3 border rounded shadow-sm bg-light text-end">
                    <span className="me-2 small fw-semibold">Aktivni izvor:</span>
                    <Badge 
                        bg={
                            trenutniIzvor === 'localStorage' ? 'primary' : 
                            trenutniIzvor === 'firebase' ? 'success' : 'warning'
                        } 
                        className="me-3 text-dark"
                    >
                        {trenutniIzvor}
                    </Badge>
                    <Button variant="outline-dark" size="sm" onClick={promjeniIzvorPodataka}>
                        🔄 Prebaci izvor
                    </Button>
                </div>
            </div>

            {poruka && (
                <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
                    {poruka.tekst}
                </Alert>
            )}

            <Row className="g-3">
                <Col md={3}>
                    <Form onSubmit={handleGenerirajLokacije} className="p-3 border rounded shadow-sm bg-light">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Broj lokacija</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="100"
                                value={brojLokacija}
                                onChange={(e) => setBrojLokacija(parseInt(e.target.value))}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Generiranje...' : 'Generiraj lokacije'}
                        </Button>
                    </Form>
                </Col>

                <Col md={3}>
                    <Form onSubmit={handleGenerirajPrijave} className="p-3 border rounded shadow-sm bg-light">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Broj prijava</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="200"
                                value={brojPrijava}
                                onChange={(e) => setBrojPrijava(parseInt(e.target.value))}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Generiranje...' : 'Generiraj prijave'}
                        </Button>
                    </Form>
                </Col>

                <Col md={3}>
                    <Form onSubmit={handleGenerirajFishijade} className="p-3 border rounded shadow-sm bg-light">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Broj fišijada</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojFishijada}
                                onChange={(e) => setBrojFishijada(parseInt(e.target.value))}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Generiranje...' : 'Generiraj fišijade'}
                        </Button>
                    </Form>
                </Col>

                <Col md={3}>
                    <Form onSubmit={handleGenerirajKorisnike} className="p-3 border rounded shadow-sm bg-light">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Broj korisnika (samo obični)</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojKorisnika}
                                onChange={(e) => setBrojKorisnika(parseInt(e.target.value))}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Generiranje...' : 'Generiraj korisnike'}
                        </Button>
                    </Form>
                </Col>
            </Row>

            <div className="p-3 border rounded shadow-sm bg-white mt-4 text-center">
                <h4 className="fs-5 mb-2">📸 Brzo punjenje galerija za postojeće prijave</h4>
                <p className="text-muted small mb-3">
                    Ako već imaš prijave u bazi, klikom na ovaj gumb odmah ćeš im dodati nasumične lokalne slike u galeriju.
                </p>
                <Button variant="warning" onClick={napuniPostojecePrijaveSlikama} disabled={loading} className="fw-semibold px-4">
                    {loading ? 'Punjenje u tijeku...' : '🖼️ Napuni sve postojeće prijave lokalnim slikama'}
                </Button>
            </div>

            <Alert variant="warning" className="mt-4">
                <strong>Preporučen redoslijed:</strong> Lokacije → Prijave → Fišijade.
            </Alert>

            <hr className="my-4" />

            <h3>Brisanje podataka</h3>
            <p className="text-muted">
                Opcije za trajno brisanje podataka iz trenutnog izvora.
            </p>

            <Row className="mt-3 g-2">
                <Col md={3}>
                    <Button variant="danger" onClick={() => otvoriModalZaBrisanje('lokacije')} disabled={loading} className="w-100">
                        Obriši sve lokacije
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="danger" onClick={() => otvoriModalZaBrisanje('prijave')} disabled={loading} className="w-100">
                        Obriši sve prijave
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="danger" onClick={() => otvoriModalZaBrisanje('fishijade')} disabled={loading} className="w-100">
                        Obriši sve fišijade
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="danger" onClick={() => otvoriModalZaBrisanje('korisnici')} disabled={loading} className="w-100">
                        Obriši sve korisnike
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}