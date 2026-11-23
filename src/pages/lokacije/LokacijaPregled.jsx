import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import LokacijaService from "../../services/lokacije/LokacijaService"
import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'
import { NumericFormat } from 'react-number-format'
import { RouteNames } from '../../constants'
import { Button, Modal, Container } from "react-bootstrap"
import FormatDatuma from "../../components/FormatDatuma"
import PrijavaService from "../../services/prijave/PrijavaService"
import zadanaSlikaLokacije from "../../assets/slikelokacija/knezevivinogradi.jpg"
import useBreakpoint from "../../hooks/useBreakpoint"

export default function LokacijePregled() {
    return (
        <Container className="px-2 px-md-3">
            <h3 className='my-3 fs-4 fs-md-3'>Pregled lokacija</h3>
            <LokacijeIzbor />
        </Container>
    )
}

function LokacijeIzbor() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'

    const [lokacije, setLokacije] = useState([])
    const [prijave, setPrijave] = useState([])
    const [korisnik, setKorisnik] = useState(null)
    const navigate = useNavigate()

    const [prikaziModal, setPrikaziModal] = useState(false)
    const [trenutnaSlika, setTrenutnaSlika] = useState('')
    const [trenutniNaziv, setTrenutniNaziv] = useState('')

    const [lokacijaZaBrisanje, setLokacijaZaBrisanje] = useState(null)
    const [potvrdaBrisanjaModal, setPotvrdaBrisanjaModal] = useState(false)
    const [uspjehBrisanjaModal, setUspjehBrisanjaModal] = useState(false)

    function dohvatiSlikuLokacije(mjesto) {
        if (!mjesto) return zadanaSlikaLokacije;

        const oiscenoIme = mjesto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "")

        try {
            return new URL(`../../assets/slikelokacija/${oiscenoIme}.jpg`, import.meta.url).href;
        } catch (error) {
            return zadanaSlikaLokacije
        }
    }

    async function ucitajLokacije() {
        await LokacijaService.get().then((odgovor) => {
            setLokacije(odgovor.data)
        })
    }

    async function ucitajPrijave() {
        await PrijavaService.get().then((odgovor) => {
            setPrijave(odgovor.data)
        })
    }

    useEffect(() => {
        const spremljeniKorisnik = localStorage.getItem("prijavljeniKorisnik")
        if (spremljeniKorisnik) {
            setKorisnik(JSON.parse(spremljeniKorisnik))
        }

        ucitajLokacije()
        ucitajPrijave()
    }, [])

    const isAdmin = korisnik?.uloga === "Admin"

    function pokreniBrisanje(sifra) {
        setLokacijaZaBrisanje(sifra)
        setPotvrdaBrisanjaModal(true)
    }

    async function potvrdiBrisanje() {
        if (!lokacijaZaBrisanje) return

        try {
            await LokacijaService.obrisi(lokacijaZaBrisanje)
            setPotvrdaBrisanjaModal(false)
            setLokacijaZaBrisanje(null)

            setUspjehBrisanjaModal(true)

            setTimeout(() => {
                setUspjehBrisanjaModal(false)
                ucitajLokacije()
            }, 2000)
        } catch (err) {
            console.error("Greška kod brisanja lokacije:", err)
            setPotvrdaBrisanjaModal(false)
            alert("Došlo je do greške prilikom brisanja lokacije.")
        }
    }

    function detalji(sifra) {
        navigate(RouteNames.LOKACIJE_DETALJI.replace(':sifra', sifra))
    }

    return (
        <>
            {isAdmin && (
                <Link to={RouteNames.LOKACIJE_DODAJ}
                    className="btn btn-success w-100 my-3">
                    Dodavanje nove lokacije
                </Link>
            )}

            <Table hover striped bordered responsive>
                <thead>
                    <tr>
                        <th>Mjesto</th>
                        <th>Županija</th>
                        <th>Poštanski ured</th>
                        <th>Datum održavanja</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {lokacije && lokacije.filter((lokacija) => lokacija.sifra !== 111).map((lokacija) => {
                        const slikaZaPrikaz = lokacija.slika || dohvatiSlikuLokacije(lokacija.mjesto);

                        return (
                            <tr key={lokacija.sifra}>
                                <td className='lead'>
                                    <img
                                        src={slikaZaPrikaz}
                                        alt={lokacija.mjesto}
                                        style={{
                                            width: '35px',
                                            height: '25px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            border: '1px solid #ced4da',
                                            marginRight: '10px',
                                            verticalAlign: 'middle'
                                        }}
                                        title="Klikni za uvećanje slike"
                                        onClick={() => {
                                            setTrenutnaSlika(slikaZaPrikaz)
                                            setTrenutniNaziv(lokacija.mjesto)
                                            setPrikaziModal(true)
                                        }}
                                    />
                                    {lokacija.mjesto}
                                    <span title="Broj ekipa"> ({prijave.filter(p => p.lokacija === lokacija.sifra).length})</span>
                                </td>
                                <td className='text-end'>
                                    {lokacija.zupanija}
                                </td>
                                <td className='desno'>
                                    <NumericFormat
                                        value={lokacija.posta}
                                        displayType={'text'}
                                    />
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <FormatDatuma datum={lokacija.datumOdrzavanja} prikazDatuma="Nije postavljeno" />
                                </td>
                                <td className={jeMobitel ? "d-flex flex-column gap-1" : ""}>
                                    {isAdmin && (
                                        <>
                                            <Button size="sm" className={jeMobitel ? "w-100" : ""} onClick={() => { navigate(RouteNames.LOKACIJE_PROMJENA.replace(':sifra', lokacija.sifra)) }}>
                                                Promjena
                                            </Button>
                                            {!jeMobitel && <>&nbsp;&nbsp;&nbsp;</>}
                                            <Button size="sm" variant="danger" className={jeMobitel ? "w-100" : ""} onClick={() => pokreniBrisanje(lokacija.sifra)}>
                                                Obriši
                                            </Button>
                                            {!jeMobitel && <>&nbsp;&nbsp;&nbsp;</>}
                                        </>
                                    )}
                                    <Button size="sm" variant="success" className={jeMobitel ? "w-100" : ""} onClick={() => detalji(lokacija.sifra)}>
                                        Detalji
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

            Ukupno lokacija : &nbsp;
            <Badge pill bg="success">
                {lokacije && lokacije.length}
            </Badge>
            &nbsp;

            <Modal show={prikaziModal} onHide={() => setPrikaziModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Lokacija: {trenutniNaziv}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <img
                        src={trenutnaSlika}
                        alt="Zumirana lokacija"
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: '70vh', objectFit: 'contain' }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setPrikaziModal(false)}>
                        Zatvori
                    </Button>
                </Modal.Footer>
            </Modal>

           <Modal show={potvrdaBrisanjaModal} onHide={() => setPotvrdaBrisanjaModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="fw-bold fs-5">⚠️ Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <p className="fs-5 mb-0">Jeste li sigurni da želite obrisati ovu stavku?</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center border-0 pb-3">
                    <Button variant="danger" className="rounded-pill px-4" onClick={() => setPotvrdaBrisanjaModal(false)}>
                        Odustani
                    </Button>
                    <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={potvrdiBrisanje}>
                        Prihvati
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={uspjehBrisanjaModal} centered backdrop="static">
                <Modal.Body className="text-center py-5 bg-white rounded-4 shadow-lg">
                    <div className="mb-3" style={{ fontSize: "3rem" }}>🗑️✨</div>
                    <h4 className="fw-bold text-success mb-2">Uspješno obrisano!</h4>
                    <p className="text-muted mb-0">Lokacija je uspješno uklonjena iz sustava.</p>
                </Modal.Body>
            </Modal>
        </>
    )
}