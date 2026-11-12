import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import PrijavaService from "../../services/prijave/PrijavaService"
import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'
import { FcApproval, FcDisapprove } from 'react-icons/fc'
import { NumericFormat } from 'react-number-format'
import { RouteNames } from '../../constants'
import { Button, Container, Pagination } from "react-bootstrap"
import LokacijaService from '../../services/lokacije/LokacijaService'
import { Form } from "react-bootstrap"
import { fishijade } from "../../services/FishijadaPodaci"
import useBreakpoint from "../../hooks/useBreakpoint"

export default function PrijavePregled() {
    const location = useLocation()
    const godina = location.state?.godina;

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
    );
}

function PrijaveIzbor({ godina }) {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const [prijave, setPrijave] = useState([])
    const navigate = useNavigate();
    const [lokacije, setLokacije] = useState([])
    const [odabranaLokacija, setOdabranaLokacija] = useState('')

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
        ucitajPrijave();
        LokacijaService.get().then((o) => {
            setLokacije(o.data)
        });
    }, [godina])

    async function obrisi(sifra) {
        if (!confirm('sigurno obrisati?')) {
            return;
        }

        await PrijavaService.obrisi(sifra)
        await ucitajPrijave()
    }

    async function ucitajPrijave() {
        await PrijavaService.get().then((odgovor) => {
            let podaci = odgovor.data
            setPrijave(podaci)
        })
    }

    return (
        <>
            <Link to={RouteNames.PRIJAVE_DODAJ}
                className="btn btn-success w-100 my-3">
                Dodavanje nove prijave
            </Link>
            <Link to={RouteNames.PRIJAVE_PRVENSTVO_BARANJE}
                className="btn btn-success w-100 my-3">
                Prijavi se na prvenstvo Baranje
            </Link>

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
                            <th className="text-center">Placeno</th>
                            <th className="text-center">Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prijave && trenutnePrijave.map((prijava) => {
                            const jePlaceno = prijava.kotizacijaPlacena;

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
                                            <Button variant='success' size="sm" onClick={() => { navigate(`/prijave/${prijava.sifra}`) }}>
                                                Promjena
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => obrisi(prijava.sifra)}>
                                                Obriši
                                            </Button>
                                            <Button variant="primary" size="sm" onClick={() => { navigate(`/prijave/detalji/${prijava.sifra}`) }}>
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
                        <Pagination.First 
                            disabled={trenutnaStranica === 1} 
                            onClick={() => setTrenutnaStranica(1)} 
                        />
                        <Pagination.Prev 
                            disabled={trenutnaStranica === 1} 
                            onClick={() => setTrenutnaStranica((prev) => Math.max(prev - 1, 1))} 
                        />
                        
                        {[...Array(ukupnoStranica).keys()].map((broj) => (
                            <Pagination.Item
                                key={broj + 1}
                                active={broj + 1 === trenutnaStranica}
                                onClick={() => setTrenutnaStranica(broj + 1)}
                            >
                                {broj + 1}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next 
                            disabled={trenutnaStranica === ukupnoStranica} 
                            onClick={() => setTrenutnaStranica((prev) => Math.min(prev + 1, ukupnoStranica))} 
                        />
                        <Pagination.Last 
                            disabled={trenutnaStranica === ukupnoStranica} 
                            onClick={() => setTrenutnaStranica(ukupnoStranica)} 
                        />
                    </Pagination>
                </div>
            )}

            <div className="mt-3 mb-4">
                Ukupno &nbsp;
                <Badge pill bg="success">
                    {prijave && filtriranePrijave.length}
                </Badge>
                &nbsp; prijava
            </div>
        </>
    )
}