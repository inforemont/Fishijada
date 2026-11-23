import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import FishijadaService from "../../services/fishijade/FishijadaService"
import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'
import { NumericFormat } from 'react-number-format'
import FormatDatuma from '../../components/FormatDatuma'
import { RouteNames } from '../../constants'
import { Button, Form, Modal, Pagination } from "react-bootstrap"
import LokacijaService from '../../services/lokacije/LokacijaService'
import PrijavaService from '../../services/prijave/PrijavaService'
import MiniKarta from '../../components/MiniKarta'
import { Container, Card } from 'react-bootstrap'
import useBreakpoint from '../../hooks/useBreakpoint'

export default function FishijadePregled() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const location = useLocation()
    const godina = location.state?.godina

    return (
        <Container className="px-2 px-md-3">
            <h3 className='my-3 fs-4 fs-md-3'>Pregled svih fišijada u Belom Manastiru</h3>

            {godina ? (
                <p>Odabrana je godina: <strong>{godina}.</strong></p>
            ) : (
                <p>Prikaz svih održanih fišijada.</p>
            )}
            <FishijadeIzbor godina={godina} jeMobitel={jeMobitel} />

            <Card className="p-3 p-md-4 shadow-sm my-4">
                <h4>Lokacija održavanja</h4>
                <p className="text-muted">Pogledajte točnu lokaciju natjecanja na karti:</p>

                <MiniKarta lat={45.771708} lng={18.594342} nazivMjesta="Prvenstvo Baranje" />
            </Card>
        </Container>
    )
}

function FishijadeIzbor({ godina, jeMobitel }) {
    const [fishijade, setFishijade] = useState([])
    const navigate = useNavigate()
    const [svePrijave, setSvePrijave] = useState([])

    const [odabranaFisijada, setOdabranaFisijada] = useState('')
    const [sveLokacije, setSveLokacije] = useState([])
    const [korisnik, setKorisnik] = useState(null)

    const [fishijadaZaBrisanje, setFishijadaZaBrisanje] = useState(null)
    const [potvrdaBrisanjaModal, setPotvrdaBrisanjaModal] = useState(false)
    const [uspjehBrisanjaModal, setUspjehBrisanjaModal] = useState(false)

    // Stanja za paginaciju
    const [trenutnaStranica, setTrenutnaStranica] = useState(1)
    const poStranici = 10

    useEffect(() => {
        const spremljeniKorisnik = localStorage.getItem("prijavljeniKorisnik")
        if (spremljeniKorisnik) {
            setKorisnik(JSON.parse(spremljeniKorisnik))
        }

        ucitajFishijade()
        LokacijaService.get().then((odgovor) => {
            setSveLokacije(odgovor.data)
        })

        PrijavaService.get().then((odgovor) => {
            setSvePrijave(odgovor.data)
        })
    }, [godina])

    const isAdmin = korisnik?.uloga === "Admin"

    function pokreniBrisanje(sifra) {
        setFishijadaZaBrisanje(sifra)
        setPotvrdaBrisanjaModal(true)
    }

    async function potvrdiBrisanje() {
        if (!fishijadaZaBrisanje) return

        try {
            await FishijadaService.obrisi(fishijadaZaBrisanje)
            setPotvrdaBrisanjaModal(false)
            setFishijadaZaBrisanje(null)

            setUspjehBrisanjaModal(true)

            setTimeout(() => {
                setUspjehBrisanjaModal(false)
                ucitajFishijade()
            }, 2000)
        } catch (err) {
            console.error("Greška kod brisanja fišijade:", err)
            setPotvrdaBrisanjaModal(false)
            alert("Došlo je do greške prilikom brisanja fišijade.")
        }
    }

    function detalji(sifra) {
        navigate(RouteNames.FISHIJADE_DETALJI.replace(':sifra', sifra))
    }

    async function ucitajFishijade() {
        await FishijadaService.get().then((odgovor) => {
            let podaci = odgovor.data;

            if (godina) {
                podaci = podaci.filter(f => {
                    const godinaPokretanja = new Date(f.datumPokretanja).getFullYear()
                    return godinaPokretanja === Number(godina)
                });
            }
            setFishijade(podaci)
        });
    }

    const filtriraneFishijade = odabranaFisijada
        ? fishijade.filter(f => f.sifra === Number(odabranaFisijada))
        : fishijade

    // Izračun za trenutne stavke na stranici
    const zadnjiIndeks = trenutnaStranica * poStranici
    const prviIndeks = zadnjiIndeks - poStranici
    const trenutneFishijade = filtriraneFishijade.slice(prviIndeks, zadnjiIndeks)
    const ukupnoStranica = Math.ceil(filtriraneFishijade.length / poStranici)

    // Funkcija za generiranje skraćenog prikaza stranica s točkicama
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
                <Link to={RouteNames.FISHIJADE_DODAJ} className="btn btn-success w-100 my-3">
                    Dodavanje nove fišijade
                </Link>
            )}

            <Form.Group className='mb-4'>
                <Form.Label>Odaberi fišijadu / godinu:</Form.Label>
                <Form.Select
                    value={odabranaFisijada}
                    onChange={(e) => {
                        setOdabranaFisijada(e.target.value)
                        setTrenutnaStranica(1)
                    }}
                >
                    <option value="">Sve fišijade</option>
                    {fishijade && fishijade.map((f) => {
                        const godinaF = new Date(f.datumPokretanja).getFullYear()
                        return (
                            <option key={f.sifra} value={f.sifra}>
                                {f.naziv} ({godinaF})
                            </option>
                        )
                    })}
                </Form.Select>
            </Form.Group>

            {!odabranaFisijada && (
                <>
                    <div className="table-responsive">
                        <Table hover striped bordered className="align-middle">
                            <thead>
                                <tr>
                                    <th>Naziv</th>
                                    <th>Mjesto održavanja</th>
                                    <th>Kotizacija</th>
                                    <th>Datum pokretanja</th>
                                    <th className="text-center">Održana</th>
                                    <th className="text-center">Akcija</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trenutneFishijade.map((fishijada) => {
                                    const jeOdrzana = fishijada?.datumPokretanja
                                        ? new Date(fishijada.datumPokretanja) < new Date()
                                        : false;

                                    return (
                                        <tr key={fishijada.sifra}>
                                            <td className='lead fs-6 fs-md-5'>
                                                {fishijada.naziv}
                                            </td>
                                            <td className='text-end'>
                                                {fishijada.mjestoOdrzavanja}
                                            </td>
                                            <td className='text-end'>
                                                <NumericFormat
                                                    value={fishijada.cijena}
                                                    displayType={'text'}
                                                    decimalSeparator=","
                                                    decimalScale={2}
                                                    fixedDecimalScale='.'
                                                    suffix=' €'
                                                    prefix="="
                                                />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <FormatDatuma datum={fishijada.datumPokretanja} prikazDatuma="Nije postavljeno" />
                                            </td>

                                            <td style={{ textAlign: 'center' }}>
                                                {jeOdrzana ? (
                                                    <span style={{ fontSize: '1.3rem' }} title="Održana">✅</span>
                                                ) : (
                                                    <span style={{ fontSize: '1.3rem' }} title="Nije održana">❌</span>
                                                )}
                                            </td>

                                            <td>
                                                <div className={jeMobitel ? "d-flex flex-column gap-2" : "d-flex justify-content-center gap-2"}>
                                                    {isAdmin && (
                                                        <>
                                                            <Button size="sm" onClick={() => { navigate(RouteNames.FISHIJADE_PROMJENA.replace(':sifra', fishijada.sifra)) }}>
                                                                Promjena
                                                            </Button>
                                                            <Button variant="danger" size="sm" onClick={() => pokreniBrisanje(fishijada.sifra)}>
                                                                Obriši
                                                            </Button>
                                                        </>
                                                    )}

                                                    <Button variant="success" size="sm" onClick={() => detalji(fishijada.sifra)}>
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
                </>
            )}

            {odabranaFisijada && (
                <div className="mt-4">
                    {(() => {
                        const odabrana = fishijade.find(f => f.sifra === Number(odabranaFisijada))
                        const godinaF = odabrana ? new Date(odabrana.datumPokretanja).getFullYear() : ('')

                        return (
                            <div>
                                <h4>Prvenstvo Baranje – Godina: {godinaF} ({odabrana?.naziv})</h4>
                                <p className="text-muted">Mjesto održavanja: {odabrana?.mjestoOdrzavanja}</p>

                                <div className="table-responsive">
                                    <Table hover striped bordered className="mt-3 align-middle">
                                        <thead>
                                            <tr>
                                                <th>Regionalno prvenstvo (Lokacija)</th>
                                                <th className="text-end pe-4">Broj prijavljenih ekipa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {odabrana && odabrana.lokacije && odabrana.lokacije.length > 0 ? (
                                                odabrana.lokacije.map((lokacijaId) => {
                                                    const lokacija = sveLokacije.find(l => Number(l.sifra) === Number(lokacijaId))
                                                    
                                                    const prijaveNaLokacijiIds = odabrana.prijavePoLokacijama?.[lokacijaId] || 
                                                                                 odabrana.prijavePoLokacijama?.[String(lokacijaId)] || []
                                                    
                                                    const brojPrijava = prijaveNaLokacijiIds.length > 0 
                                                        ? prijaveNaLokacijiIds.length 
                                                        : svePrijave.filter(p => Number(p.lokacijaId || p.lokacija) === Number(lokacijaId)).length

                                                    return (
                                                        <tr key={lokacijaId}>
                                                            <td>
                                                                {lokacija ? lokacija.mjesto : `Lokacija ID: ${lokacijaId}`}
                                                            </td>
                                                            <td className="text-end pe-4">
                                                                {brojPrijava}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="text-center text-muted">
                                                        Nema zabilježenih lokacija za ovu godinu.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        )
                    })()}
                </div>
            )}

            <div className="mt-3">
                Ukupno &nbsp;
                <Badge pill bg="success">
                    {filtriraneFishijade && filtriraneFishijade.length}
                </Badge>
                &nbsp; fišijada
            </div>

            <Modal show={potvrdaBrisanjaModal} onHide={() => setPotvrdaBrisanjaModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="fw-bold fs-5">⚠️ Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <p className="fs-5 mb-0">Jeste li sigurni da želite obrisati ovu fišijadu?</p>
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
                    <p className="text-muted mb-0">Fišijada je uspješno uklonjena iz sustava.</p>
                </Modal.Body>
            </Modal>
        </>
    )
}