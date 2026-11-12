import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import LokacijaService from "../../services/lokacije/LokacijaService";
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import { NumericFormat } from 'react-number-format';
import { RouteNames } from '../../constants';
import { Button, Modal } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";
import PrijavaService from "../../services/prijave/PrijavaService";
import zadanaSlikaLokacije from "../../assets/slikelokacija/knezevivinogradi.jpg";

export default function LokacijePregled() {
    return (
        <div>
            <h3 className='my-3'>Pregled lokacija</h3>
            <LokacijeIzbor />
        </div>
    )
}

function LokacijeIzbor() {
    const [lokacije, setLokacije] = useState([])
    const [prijave, setPrijave] = useState([])
    const navigate = useNavigate()

    const [prikaziModal, setPrikaziModal] = useState(false)
    const [trenutnaSlika, setTrenutnaSlika] = useState('')
    const [trenutniNaziv, setTrenutniNaziv] = useState('')

    function dohvatiSlikuLokacije(mjesto) {
        if (!mjesto) return zadanaSlikaLokacije;
        
        const oiscenoIme = mjesto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "");

        try {
            return new URL(`../../assets/slikelokacija/${oiscenoIme}.jpg`, import.meta.url).href;
        } catch (error) {
            return zadanaSlikaLokacije;
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
        ucitajLokacije()
        ucitajPrijave()
    }, [])

    async function obrisi(sifra) {
        if (!confirm('sigurno obrisati?')) {
            return
        }

        await LokacijaService.obrisi(sifra)
        await ucitajLokacije()
    }

    function detalji(sifra) {
        navigate(`/lokacije/detalji/${sifra}`)
    }

    return (
        <>
            <Link to={RouteNames.LOKACIJE_DODAJ}
                className="btn btn-success w-100 my-3">
                Dodavanje nove lokacije
            </Link>

            <Table hover striped bordered>
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
                                <td>
                                    <Button size="sm" onClick={() => { navigate(`/lokacije/${lokacija.sifra}`) }}>
                                        Promjena
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button size="sm" variant="danger" onClick={() => obrisi(lokacija.sifra)}>
                                        Obriši
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button size="sm" variant="success" onClick={() => detalji(lokacija.sifra)}>
                                        Detalji
                                    </Button>
                                </td>
                            </tr>
                        );
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
        </>
    );
}