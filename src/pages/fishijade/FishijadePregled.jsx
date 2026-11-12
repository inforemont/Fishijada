import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import FishijadaService from "../../services/FishijadaService"
import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'
import { NumericFormat } from 'react-number-format'
import FormatDatuma from '../../components/FormatDatuma'
import { RouteNames } from '../../constants'
import { Button, Form } from "react-bootstrap"
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

    useEffect(() => {
        console.log('Došao na pregled fishijada')
        ucitajFishijade()
        LokacijaService.get().then((odgovor) => {
            setSveLokacije(odgovor.data)
        })

        PrijavaService.get().then((odgovor) => {
            setSvePrijave(odgovor.data)
        })
    }, [godina])

    async function obrisi(sifra) {
        if (!confirm('sigurno obrisati?')) {
            return
        }

        await FishijadaService.obrisi(sifra)
        await ucitajFishijade()
    }

    function detalji(sifra) {
        navigate(`/fishijade/detalji/${sifra}`)
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

    return (
        <>
            <Link to={RouteNames.FISHIJADE_DODAJ}
                className="btn btn-success w-100 my-3">
                Dodavanje nove fišijade
            </Link>

            <Form.Group className='mb-4'>
                <Form.Label>Odaberi fišijadu / godinu:</Form.Label>
                <Form.Select
                    value={odabranaFisijada}
                    onChange={(e) => setOdabranaFisijada(e.target.value)}
                >
                    <option value="">Sve fišijade</option>
                    {fishijade && fishijade.map((f) => {
                        const godinaF = new Date(f.datumPokretanja).getFullYear()
                        return (
                            <option key={f.sifra} value={f.sifra}>
                                {f.naziv} ({godinaF})
                            </option>
                        );
                    })}
                </Form.Select>
            </Form.Group>
            {!odabranaFisijada && (
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
                            {filtriraneFishijade && filtriraneFishijade.map((fishijada) => {
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
                                                <Button size="sm" onClick={() => { navigate(`/fishijade/${fishijada.sifra}`) }}>
                                                    Promjena
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => obrisi(fishijada.sifra)}>
                                                    Obriši
                                                </Button>
                                                <Button variant="success" size="sm" onClick={() => detalji(fishijada.sifra)}>
                                                    Detalji
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
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
                                                <th>Broj prijavljenih ekipa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {odabrana && odabrana.lokacije && odabrana.lokacije.length > 0 ? (
                                                odabrana.lokacije.map((lokacijaId) => {
                                                    const lokacija = sveLokacije.find(l => l.sifra === lokacijaId)
                                                    const brojPrijava = svePrijave.filter(
                                                        p => p.lokacija === lokacijaId || p.lokacijaSifra === lokacijaId || p.lokacijaId === lokacijaId
                                                    ).length

                                                    return (
                                                        <tr key={lokacijaId}>
                                                            <td colSpan="2">
                                                                {lokacija ? lokacija.mjesto : 'Nepoznata lokacija'} ({brojPrijava})
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
                        );
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
        </>
    );
}