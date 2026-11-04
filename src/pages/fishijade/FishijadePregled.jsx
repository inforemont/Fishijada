import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import FishijadaService from "../../services/FishijadaService";
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import { GrValidate } from 'react-icons/gr';
import { FcApproval, FcDisapprove } from 'react-icons/fc';
import { NumericFormat } from 'react-number-format';
import FormatDatuma from '../../components/FormatDatuma';
import { RouteNames } from '../../constants';
import { Button, Form } from "react-bootstrap";
import LokacijaService from '../../services/lokacije/LokacijaService';
import PrijavaService from '../../services/prijave/PrijavaService';
import MiniKarta from '../../components/MiniKarta';
import {Container, Card}from 'react-bootstrap'

export default function FishijadePregled() {
    const location = useLocation()
    const godina = location.state?.godina



    return (
        <Container>
            <h3 className='my-3'>Pregled svih fišijada u Belom Manastiru</h3>

            {godina ? (
                <p>Odabrana je godina: <strong>{godina}.</strong></p>
            ) : (
                <p>Prikaz svih održanih fišijada:.</p>
            )}
            <FishijadeIzbor godina={godina} />

        <Card className="p-4 shadow-sm my-4">
                <h4>Lokacija održavanja</h4>
                <p className="text-muted">Pogledajte točnu lokaciju natjecanja na karti:</p>
                
                <MiniKarta lat={45.771708} lng={18.594342} nazivMjesta="Prvenstvo Baranje" />
            </Card>
            </Container>
    )
}


function FishijadeIzbor({ godina }) {
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

                        const godina = new Date(f.datumPokretanja).getFullYear()
                        return (
                            <option key={f.sifra} value={f.sifra}>
                                {f.naziv} ({godina})
                            </option>
                        );
                    })}
                </Form.Select>
            </Form.Group>
            {!odabranaFisijada && (
                <Table hover striped bordered>
                    <thead>
                        <tr>
                            <th>Naziv</th>
                            <th>Mjesto održavanja</th>
                            <th>Kotizacija</th>
                            <th>Datum pokretanja</th>
                            <th>Održana</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtriraneFishijade && filtriraneFishijade.map((fishijada) => {
                            const jeOdrzana = fishijada.održana ?? fishijada.održan ?? fishijada.odrzana;

                            return (
                                <tr
                                    key={fishijada.sifra}

                                >
                                    <td className='lead'>
                                        {fishijada.naziv}
                                    </td>
                                    <td className='text-end'>
                                        {fishijada.mjestoOdrzavanja}
                                    </td>
                                    <td className='desno'>
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

                                    <td>
                                        <GrValidate
                                            size={25}
                                            color={jeOdrzana ? 'green' : 'red'}
                                            title={jeOdrzana ? 'Održana' : 'Nije održana'}
                                        />
                                        &nbsp;
                                        {jeOdrzana ? (
                                            <FcApproval />
                                        ) : (
                                            <FcDisapprove />
                                        )}
                                    </td>
                                    <td>
                                        <Button onClick={() => { navigate(`/fishijade/${fishijada.sifra}`) }}>
                                            Promjena
                                        </Button>
                                        &nbsp;&nbsp;&nbsp;
                                        <Button variant="danger" onClick={() => obrisi(fishijada.sifra)}>
                                            Obriši
                                        </Button>
                                        &nbsp;&nbsp;&nbsp;

                                        <Button variant="success" onClick={() => detalji(fishijada.sifra)}>
                                            Detalji
                                        </Button>
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}


            {odabranaFisijada && (
                <div className="mt-4">
                    {(() => {
                        const odabrana = fishijade.find(f => f.sifra === Number(odabranaFisijada))
                        const godina = odabrana ? new Date(odabrana.datumPokretanja).getFullYear() : ('')

                        return (
                            <div>
                                <h4>Prvenstvo Baranje – Godina: {godina} ({odabrana?.naziv})</h4>
                                <p className="text-muted">Mjesto održavanja: {odabrana?.mjestoOdrzavanja}</p>

                                <Table hover striped bordered className="mt-3">
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
                        );
                    })()}
                </div>
            )}

            Ukupno &nbsp;
            <Badge pill bg="success">
                {filtriraneFishijade && filtriraneFishijade.length}
            </Badge>
            &nbsp; fishijada
        </>
    );
}