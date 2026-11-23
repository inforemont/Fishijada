import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import PrijavaService from "../../services/prijave/PrijavaService"
import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'
import { FcApproval, FcDisapprove } from 'react-icons/fc'
import { NumericFormat } from 'react-number-format'
import { RouteNames } from '../../constants'
import { Button, Container, Pagination, Modal, Form } from "react-bootstrap"
import LokacijaService from '../../services/lokacije/LokacijaService'
import { fishijade } from "../../services/fishijade/FishijadaPodaci"
import useBreakpoint from "../../hooks/useBreakpoint"

export default function PrijavePregled() {
    const location = useLocation()
    const godina = location.state?.godina

    return (
        <Container className="px-2 px-md-3">
            <h3 className='my-3 fs-4 fs-md-3'>Pregled prijava</h3>

            {godina ? (
                <p>Odabrana je godina: <strong>{godina}.</strong></p>
            ) : (
                <p>Nije odabrana niti jedna godina (prikaz svih prijava).</p>
            )}
            <PrijaveIzbor godina={godina} />
        </Container>
    )
}

function PrijaveIzbor({ godina }) {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const [prijave, setPrijave] = useState([])
    const navigate = useNavigate();
    const [lokacije, setLokacije] = useState([])
    const [odabranaLokacija, setOdabranaLokacija] = useState('')
    const [korisnik, setKorisnik] = useState(null)

    const [prijavaZaBrisanje, setPrijavaZaBrisanje] = useState(null)
    const [potvrdaBrisanjaModal, setPotvrdaBrisanjaModal] = useState(false)
    const [uspjehBrisanjaModal, setUspjehBrisanjaModal] = useState(false)
    const [gostModal, setGostModal] = useState(false)

    const [trenutnaStranica, setTrenutnaStranica] = useState(1)
    const poStranici = 10

    const filtriranePrijave = prijave.filter((prijava) => {
        if (odabranaLokacija === '') return true
        return prijava.lokacija == odabranaLokacija
    })

    const zadnjiIndeks = trenutnaStranica * poStranici
    const prviIndeks = zadnjiIndeks - poStranici
    const trenutnePrijave = filtriranePrijave.slice(prviIndeks, zadnjiIndeks)
    const ukupnoStranica = Math.ceil(filtriranePrijave.length / poStranici)

    useEffect(() => {
        const spremljeniKorisnik = localStorage.getItem("prijavljeniKorisnik")
        if (spremljeniKorisnik) {
            setKorisnik(JSON.parse(spremljeniKorisnik))
        }

        ucitajPrijave();
        LokacijaService.get().then((o) => {
            setLokacije(o.data)
        });
    }, [godina])

    const isAdmin = korisnik?.uloga === "Admin"

    function pokreniBrisanje(sifra) {
        setPrijavaZaBrisanje(sifra)
        setPotvrdaBrisanjaModal(true)
    }

    async function potvrdiBrisanje() {
        if (!prijavaZaBrisanje) return

        try {
            await PrijavaService.obrisi(prijavaZaBrisanje)
            setPotvrdaBrisanjaModal(false)
            setPrijavaZaBrisanje(null)

            setUspjehBrisanjaModal(true)

            setTimeout(() => {
                setUspjehBrisanjaModal(false)
                ucitajPrijave()
            }, 2000)
        } catch (err) {
            console.error("Greška kod brisanja prijave:", err)
            setPotvrdaBrisanjaModal(false)
        }
    }

    async function ucitajPrijave() {
        await PrijavaService.get().then((odgovor) => {
            setPrijave(odgovor.data)
        })
    }

    return (
        <>
            {korisnik ? (
                <Link to={RouteNames.PRIJAVE_DODAJ} className="btn btn-success w-100 my-3">
                    Dodavanje nove prijave
                </Link>
            ) : (
                <div className="w-100 my-3" onClick={() => setGostModal(true)} style={{ cursor: 'pointer' }}>
                    <Button variant="success" className="w-100" disabled style={{ pointerEvents: 'none' }}>
                        Dodavanje nove prijave
                    </Button>
                </div>
            )}

            <Form.Group className='mb-4'>
                <Form.Label>Filtriraj po lokaciji:</Form.Label>
                <Form.Select
                    value={odabranaLokacija}
                    onChange={(e) => {
                        setOdabranaLokacija(e.target.value)
                        setTrenutnaStranica(1)
                    }}
                >
                    <option value="">Sve lokacije</option>
                    {lokacije && lokacije.map((l) => (
                        <option key={l.sifra} value={l.sifra}>
                            {l.mjesto}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <div className="table-responsive">
                <Table hover striped bordered className="align-middle">
                    <thead>
                        <tr>
                            <th>Ime i prezime</th>
                            <th>Ekipa</th>
                            <th>Stol</th>
                            <th>E-mail</th>
                            <th>Lokacija</th>
                            <th className="text-center">Plaćeno</th>
                            <th className="text-center">Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prijave && trenutnePrijave.map((prijava) => {
                            const jePlaceno = prijava.kotizacijaPlacena;
                            
                            const jeVlasnik = korisnik && prijava.korisnikSifra && String(prijava.korisnikSifra) === String(korisnik.sifra)
                            const smijeUredivati = isAdmin || jeVlasnik

                            return (
                                <tr key={prijava.sifra}>
                                    <td className='lead fs-6 fs-md-5'>
                                        {prijava.imePrezime}
                                    </td>
                                    <td className='text-end'>
                                        {prijava.ekipa}
                                    </td>
                                    <td className='desno'>
                                        <NumericFormat
                                            value={prijava.stol}
                                            displayType={'text'}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {prijava.email}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {prijava.lokacija ? (
                                            lokacije.find((l) => l.sifra === prijava.lokacija)?.mjesto ||
                                            fishijade.find((f) => f.sifra === prijava.lokacija)?.mjesto ||
                                            '-'
                                        ) : '-'}
                                    </td>

                                    <td style={{ textAlign: 'center' }}>
                                        {jePlaceno ? (
                                            <FcApproval size={25} />
                                        ) : (
                                            <FcDisapprove size={25} />
                                        )}
                                    </td>

                                    <td>
                                        <div className={jeMobitel ? "d-flex flex-column gap-2" : "d-flex justify-content-center gap-2"}>
                                            {smijeUredivati && (
                                                <>
                                                    <Button variant='success' size="sm" onClick={() => { navigate(RouteNames.PRIJAVE_PROMJENA.replace(':sifra', prijava.sifra)) }}>
                                                        Promjena
                                                    </Button>
                                                    <Button variant="danger" size="sm" onClick={() => pokreniBrisanje(prijava.sifra)}>
                                                        Obriši
                                                    </Button>
                                                </>
                                            )}

                                            <Button variant="primary" size="sm" onClick={() => { navigate(RouteNames.PRIJAVE_DETALJI.replace(':sifra', prijava.sifra)) }}>
                                                Galerija
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>

            {ukupnoStranica > 1 && (
                <div className="d-flex justify-content-center my-4">
                    <Pagination>
                        <Pagination.First disabled={trenutnaStranica === 1} onClick={() => setTrenutnaStranica(1)} />
                        <Pagination.Prev disabled={trenutnaStranica === 1} onClick={() => setTrenutnaStranica((prev) => Math.max(prev - 1, 1))} />
                        {[...Array(ukupnoStranica).keys()].map((broj) => (
                            <Pagination.Item key={broj + 1} active={broj + 1 === trenutnaStranica} onClick={() => setTrenutnaStranica(broj + 1)}>
                                {broj + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next disabled={trenutnaStranica === ukupnoStranica} onClick={() => setTrenutnaStranica((prev) => Math.min(prev + 1, ukupnoStranica))} />
                        <Pagination.Last disabled={trenutnaStranica === ukupnoStranica} onClick={() => setTrenutnaStranica(ukupnoStranica)} />
                    </Pagination>
                </div>
            )}

            <div className="mt-3 mb-4">
                Ukupno &nbsp;
                <Badge pill bg="success">{prijave && filtriranePrijave.length}</Badge>
                &nbsp; prijava
            </div>

            <Modal show={gostModal} onHide={() => setGostModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="fw-bold fs-5">🔒 Potrebna prijava</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <p className="fs-5 mb-0">Za predaju nove prijave potrebno se prijaviti u sustav.</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center border-0 pb-3">
                    <Button variant="danger" className="rounded-pill px-4" onClick={() => setGostModal(false)}>
                        Odustani
                    </Button>
                    <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => { setGostModal(false); navigate(RouteNames.LOGIN); }}>
                        Prijava
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={potvrdaBrisanjaModal} onHide={() => setPotvrdaBrisanjaModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="fw-bold fs-5">⚠️ Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <p className="fs-5 mb-0">Jeste li sigurni da želite obrisati ovu prijavu?</p>
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
                    <p className="text-muted mb-0">Prijava je uspješno uklonjena iz sustava.</p>
                </Modal.Body>
            </Modal>
        </>
    )
}