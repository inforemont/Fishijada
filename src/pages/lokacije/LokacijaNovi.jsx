import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import LokacijaService from "../../services/lokacije/LokacijaService"
import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'
import { NumericFormat } from 'react-number-format'
import { RouteNames } from '../../constants'
import { Button, Modal, Container, Pagination, Card } from "react-bootstrap"
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

    // Stanja za paginaciju
    const [trenutnaStranica, setTrenutnaStranica] = useState(1)
    const poStranici = 10

    const filtriraneLokacije = lokacije ? lokacije.filter((lokacija) => lokacija.sifra !== 111) : []

    const zadnjiIndeks = trenutnaStranica * poStranici
    const prviIndeks = zadnjiIndeks - poStranici
    const trenutneLokacije = filtriraneLokacije.slice(prviIndeks, zadnjiIndeks)
    const ukupnoStranica = Math.ceil(filtriraneLokacije.length / poStranici)

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

    const dohvatiStraniceZaPrikaz = () => {
        const stranice = []
        if (ukupnoStranica <= 6) {
            for (let i = 1; i <= ukupnoStranica; i++) {
                stranice.push(i)
            }
        } else {
            stranice.push(1, 2, 3)
            
            if (trenutnaStranica > 4 && trenutnaStranica < ukupnoStranica - 3) {
                stranice.push('...', trenutnaStranica)
            } else {
                stranice.push('...')
            }

            stranice.push(ukupnoStranica - 2, ukupnoStranica - 1, ukupnoStranica)
        }
        return [...new Set(stranice)]
    }

    return (
        <>
            {isAdmin && (
                <Link to={RouteNames.LOKACIJE_DODAJ} className="btn btn-success w-100 my-3">
                    Dodavanje nove lokacije
                </Link>
            )}

            {/* Tablica za veće ekrane */}
            {!jeMobitel && (
                <div className="table-responsive">
                    <Table hover striped bordered className="align-middle">
                        <thead>
                            <tr>
                                <th>Mjesto</th>
                                <th>Županija</th>
                                <th>Poštanski ured</th>
                                <th>Datum održavanja</th>
                                <th className="text-center">Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trenutneLokacije.map((lokacija) => {
                                const slikaZaPrikaz = lokacija.slika || dohvatiSlikuLokacije(lokacija.mjesto);
                                const brojEkipa = prijave.filter(p => Number(p.lokacija) === Number(lokacija.sifra)).length;

                                return (
                                    <tr key={lokacija.sifra}>
                                        <td className='lead'>
                                            <img
                                                src={slikaZaPrikaz}
                                                alt={lokacija.mjesto}
                                                loading="lazy"
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
                                            <span title="Broj ekipa"> ({brojEkipa})</span>
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
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2 align-items-center">
                                                {isAdmin && (
                                                    <>
                                                        <Button size="sm" onClick={() => { navigate(RouteNames.LOKACIJE_PROMJENA.replace(':sifra', lokacija.sifra)) }}>
                                                            Promjena
                                                        </Button>
                                                        <Button size="sm" variant="danger" onClick={() => pokreniBrisanje(lokacija.sifra)}>
                                                            Obriši
                                                        </Button>
                                                    </>
                                                )}
                                                <Button size="sm" variant="success" onClick={() => detalji(lokacija.sifra)}>
                                                    Detalji
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Kartični prikaz (Grid) za mobitele */}
            {jeMobitel && (
                <div className="d-flex flex-column gap-3">
                    {trenutneLokacije.map((lokacija) => {
                        const slikaZaPrikaz = lokacija.slika || dohvatiSlikuLokacije(lokacija.mjesto);
                        const brojEkipa = prijave.filter(p => Number(p.lokacija) === Number(lokacija.sifra)).length;

                        return (
                            <Card key={lokacija.sifra} className="shadow-sm border-0 rounded-3 p-3">
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <img
                                        src={slikaZaPrikaz}
                                        alt={lokacija.mjesto}
                                        loading="lazy"
                                        style={{
                                            width: '50px',
                                            height: '35px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            border: '1px solid #ced4da'
                                        }}
                                        title="Klikni za uvećanje slike"
                                        onClick={() => {
                                            setTrenutnaSlika(slikaZaPrikaz)
                                            setTrenutniNaziv(lokacija.mjesto)
                                            setPrikaziModal(true)
                                        }}
                                    />
                                    <div>
                                        <h5 className="fw-bold text-success mb-0">{lokacija.mjesto}</h5>
                                        <span className="small text-muted">Broj ekipa: {brojEkipa}</span>
                                    </div>
                                </div>
                                
                                <div className="small text-muted mb-3">
                                    <div><strong>Županija:</strong> {lokacija.zupanija}</div>
                                    <div><strong>Poštanski ured:</strong> <NumericFormat value={lokacija.posta} displayType={'text'} /></div>
                                    <div><strong>Datum održavanja:</strong> <FormatDatuma datum={lokacija.datumOdrzavanja} prikazDatuma="Nije postavljeno" /></div>
                                </div>

                                <div className="d-flex flex-column gap-2">
                                    <Button variant="success" size="sm" onClick={() => detalji(lokacija.sifra)}>
                                        Detalji
                                    </Button>
                                    {isAdmin && (
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-primary" size="sm" className="w-100" onClick={() => { navigate(RouteNames.LOKACIJE_PROMJENA.replace(':sifra', lokacija.sifra)) }}>
                                                Promjena
                                            </Button>
                                            <Button variant="outline-danger" size="sm" className="w-100" onClick={() => pokreniBrisanje(lokacija.sifra)}>
                                                Obriši
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {ukupnoStranica > 1 && (
                <div className="d-flex justify-content-center my-4">
                    <Pagination>
                        <Pagination.First disabled={trenutnaStranica === 1} onClick={() => setTrenutnaStranica(1)} />
                        <Pagination.Prev disabled={trenutnaStranica === 1} onClick={() => setTrenutnaStranica((prev) => Math.max(prev - 1, 1))} />
                        
                        {dohvatiStraniceZaPrikaz().map((item, index) => {
                            if (item === '...') {
                                return <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
                            }
                            return (
                                <Pagination.Item 
                                    key={item} 
                                    active={item === trenutnaStranica} 
                                    onClick={() => setTrenutnaStranica(item)}
                                >
                                    {item}
                                </Pagination.Item>
                            )
                        })}

                        <Pagination.Next disabled={trenutnaStranica === ukupnoStranica} onClick={() => setTrenutnaStranica((prev) => Math.min(prev + 1, ukupnoStranica))} />
                        <Pagination.Last disabled={trenutnaStranica === ukupnoStranica} onClick={() => setTrenutnaStranica(ukupnoStranica)} />
                    </Pagination>
                </div>
            )}

            <div className="mt-3 mb-4">
                Ukupno lokacija : &nbsp;
                <Badge pill bg="success">
                    {filtriraneLokacije.length}
                </Badge>
            </div>

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
                        Prihvati (Potvrdi)
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