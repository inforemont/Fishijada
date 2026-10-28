import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import PrijavaService from "../../services/prijave/PrijavaService";
import { useEffect, useState } from "react";
import LokacijaService from "../../services/lokacije/LokacijaService";




export default function PrijavaPromjena() {

    const navigate = useNavigate()
    const params = useParams()

    const [lokacije, setLokacije] = useState([])
    const [odabranaLokacija, setOdabranaLokacija] = useState('')

    const [prijava, setPrijava] = useState({})


    async function ucitajPrijave() {

        try {

            const odgovorLokacije = await LokacijaService.get()
            setLokacije(odgovorLokacije.data)

            const odgovorPrijava = await PrijavaService.getBySifra(params.sifra)
            setPrijava(odgovorPrijava.data)

            if (odgovorPrijava.data.lokacijaSifra) {
                setOdabranaLokacija(odgovorPrijava.data.lokacijaSifra)
            }
        } catch (error) {
            console.error("Ne mogu učitati podatke", error)
        }
    }




    useEffect(() => {
        ucitajPrijave()
    }, [])

    async function promjeni(prijavaSlanje) {
        await PrijavaService.promjeni(params.sifra, prijavaSlanje).then(() => {
            navigate(RouteNames.PRIJAVE)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        promjeni({
            imePrezime: podaci.get('imePrezime'),
            ekipa: podaci.get('ekipa'),
            stol: parseInt(podaci.get('stol')),
            email: podaci.get('email'),
            kotizacijaPlacena: podaci.get('kotizacijaPlacena') === 'on',
            lokacija: parseInt(odabranaLokacija)
        })
    }


    return (
        <>
            <h3 className="my-3">
                Promijeni prijavu
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="imePrezime">
                    <Form.Label>IME I PREZIME</Form.Label>
                    <Form.Control type="text" name="imePrezime" required
                        defaultValue={prijava.imePrezime} />
                </Form.Group>

                <Form.Group controlId="ekipa">
                    <Form.Label>EKIPA</Form.Label>
                    <Form.Control type="text" name="ekipa" required
                        defaultValue={prijava.ekipa} />
                </Form.Group>

                <Form.Group controlId="stol">
                    <Form.Label>STOL</Form.Label>
                    <Form.Control type="number" name="stol" required
                        defaultValue={prijava.stol} />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" name="email" required
                        defaultValue={prijava.email} />
                </Form.Group>

                <Form.Group controlId="kotizacijaPlacena" className="mt-3">
                    <Form.Check
                        label="Kotizacija uplaćena"
                        name="kotizacijaPlacena"
                        defaultChecked={prijava && prijava.kotizacijaPlacena}
                    />
                </Form.Group>

                <Form.Group controlId="lokacija" className="mt-3">
                    <Form.Label>LOKACIJA</Form.Label>
                    <Form.Select
                        name="lokacija"
                        required
                        value={odabranaLokacija}
                        onChange={(e) => setOdabranaLokacija(e.target.value)}
                    >
                        <option value="">Odaberi lokaciju...</option>
                        {lokacije && lokacije.map((l) => (
                            <option key={l.sifra} value={l.sifra}>
                                {l.mjesto}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>


                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.PRIJAVE}
                            className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promijeni
                        </Button>
                    </Col>
                </Row>
            </Form>


        </>
    )
}