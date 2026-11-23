import { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col, Badge } from 'react-bootstrap';
import { Faker, hr } from '@faker-js/faker';
import FishijadaService from '../services/fishijade/FishijadaService';
import PrijavaService from '../services/prijave/PrijavaService';
import LokacijaService from '../services/lokacije/LokacijaService';
import KorisnikService from '../services/logiranje/KorisnikService';
import { DATA_SOURCE } from '../constants';

export default function GeneriranjePodataka() {
    const [trenutniIzvor, setTrenutniIzvor] = useState(DATA_SOURCE);

    const [brojFishijada, setBrojFishijada] = useState(8)
    const [brojPrijava, setBrojPrijava] = useState(30)
    const [brojLokacija, setBrojLokacija] = useState(10)
    const [brojKorisnika, setBrojKorisnika] = useState(5)
    const [poruka, setPoruka] = useState(null)
    const [loading, setLoading] = useState(false)

    const faker = new Faker({
        locale: [hr]
    })

    const uvoziSlikeIzMape = () => {
        try {
            const uvoziModule = import.meta.glob('../assets/slikegalerija/*.{jpg,jpeg,png,webp,avif}', { eager: true });
            return Object.values(uvoziModule).map(modul => modul.default);
        } catch (e) {
            console.log("Mapa sa slikama nije pronađena ili je prazna.");
            return [];
        }
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
        setPoruka({
            tip: 'info',
            tekst: `Izvor podataka uspješno promijenjen na: ${noviIzvor}`
        })
    }

    const generirajFishijade = async (broj) => {
        const rezultatLokacija = await LokacijaService.get()
        const lokacije = rezultatLokacija.data || []

        const rezultatPrijava = await PrijavaService.get()
        const prijave = rezultatPrijava.data || []

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
                        const odabranePrijaveZaLokaciju = faker.helpers.arrayElements(prijave, brojPrijavaZaOvuLokaciju);
                        prijavePoLokacijama[lokacija.sifra] = odabranePrijaveZaLokaciju.map(p => p.sifra);
                    })
                }
            }

            const fishijada = {
                naziv: `Prvenstvo Baranje ${2020 + i}`,
                mjestoOdrzavanja: 'Beli Manastir',
                cijena: faker.number.float({ min: 10, max: 30, precision: 1 }),
                datumPokretanja: new Date(2020 + i, 4, 15).toISOString(),
                aktivan: i === 0,
                lokacije: randomLokacijeSifre,
                prijavePoLokacijama: prijavePoLokacijama
            }

            await FishijadaService.dodaj(fishijada)
        }
    }

    const generirajPrijave = async (broj) => {
        let rezultatLokacija = await LokacijaService.get()
        let lokacije = rezultatLokacija.data || []

        const sveSlikeIzMape = uvoziSlikeIzMape();

        for (const lokacija of lokacije) {
            const brojPrijavaZaOvuLokaciju = faker.number.int({ min: 1, max: Math.min(20, broj) })

            for (let j = 0; j < brojPrijavaZaOvuLokaciju; j++) {
                let odabraneSlikeZaPrijavu = [];
                if (sveSlikeIzMape.length > 0) {
                    const brojSlikaZaUbaciti = faker.number.int({ min: 1, max: Math.min(10, sveSlikeIzMape.length) });
                    odabraneSlikeZaPrijavu = faker.helpers.arrayElements(sveSlikeIzMape, brojSlikaZaUbaciti);
                }

                const prijava = {
                    imePrezime: faker.person.firstName() + ' ' + faker.person.lastName(),
                    ekipa: 'Ekipa ' + faker.person.lastName() + ' ' + faker.number.int({ min: 1, max: 100 }),
                    stol: faker.number.int({ min: 1, max: 150 }),
                    email: faker.internet.email(),
                    kotizacijaPlacena: faker.datatype.boolean(),
                    prvenstvoHrvatske: false,
                    lokacija: lokacija.sifra,
                    slike: odabraneSlikeZaPrijavu
                }

                await PrijavaService.dodaj(prijava);
            }
        }
    }

    const generirajLokacije = async (broj) => {
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
        setLoading(true)
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
        }
    };

    const handleGenerirajPrijave = async (e) => {
        e.preventDefault()
        setLoading(true)
        setPoruka(null)

        try {
            const provjeraLokacija = await LokacijaService.get()
            if (!provjeraLokacija.data || provjeraLokacija.data.length === 0) {
                setPoruka({ tip: 'warning', tekst: 'Prvo morate generirati lokacije prije generiranja prijava!' })
                setLoading(false)
                return
            }

            await generirajPrijave(brojPrijava)
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojPrijava} prijava s nasumičnim slikama iz galerije!` })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju prijava: ' + error.message })
        } finally {
            setLoading(false)
        }
    }

    const handleGenerirajLokacije = async (e) => {
        e.preventDefault()
        setLoading(true)
        setPoruka(null)

        try {
            await generirajLokacije(brojLokacija)
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojLokacija} lokacija!` })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju lokacija: ' + error.message })
        } finally {
            setLoading(false)
        }
    }

    const handleGenerirajKorisnike = async (e) => {
        e.preventDefault()
        setLoading(true)
        setPoruka(null)

        try {
            await generirajKorisnike(brojKorisnika)
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${brojKorisnika} običnih korisnika!` })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri generiranju korisnika: ' + error.message })
        } finally {
            setLoading(false)
        }
    }

    const handleObrisiPrijave = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve prijave?')) return
        setLoading(true)
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
        }
    }

    const handleObrisiFishijade = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve fišijade?')) return
        setLoading(true)
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
        }
    }

    const handleObrisiLokacije = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve lokacije?')) return
        setLoading(true)
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
        }
    }

    const handleObrisiKorisnike = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve korisnike?')) return
        setLoading(true)
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
        }
    }

    return (
        <Container className="mt-4 mb-5">
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

            <Alert variant="warning" className="mt-4">
                <strong>Preporučen redoslijed:</strong> Lokacije → Prijave → Fišijade (Prijave automatski povlače do 10 nasumičnih slika iz mape `src/assets/slikegalerija`).
            </Alert>

            <hr className="my-4" />

            <h3>Brisanje podataka</h3>
            <p className="text-muted">
                Opcije za trajno brisanje podataka iz trenutnog izvora.
            </p>

            <Row className="mt-3 g-2">
                <Col md={3}>
                    <Button variant="danger" onClick={handleObrisiLokacije} disabled={loading} className="w-100">
                        Obriši sve lokacije
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="danger" onClick={handleObrisiPrijave} disabled={loading} className="w-100">
                        Obriši sve prijave
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="danger" onClick={handleObrisiFishijade} disabled={loading} className="w-100">
                        Obriši sve fišijade
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="danger" onClick={handleObrisiKorisnike} disabled={loading} className="w-100">
                        Obriši sve korisnike
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}