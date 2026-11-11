import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import LokacijaService from "../../services/lokacije/LokacijaService";

export default function LokacijaNovi() {
    const navigate = useNavigate()

    async function dodaj(lokacija) {
        await LokacijaService.dodaj(lokacija).then(() => {
            navigate(RouteNames.LOKACIJE)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        dodaj({
            regija: podaci.get('regija'),
            mjesto: podaci.get('mjesto'),
            zupanija: podaci.get('zupanija'),
            datumOdrzavanja:podaci.get('datumOdrzavanja'),
            posta: parseFloat(podaci.get('posta')),

            ekipe: []
        })
    }

    return (
        <>
            <h3 className="my-3">
                Dodavanje nove lokacije
            </h3>

            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="regija" className="mb-3">
                    <Form.Label>REGIJA</Form.Label>
                    <Form.Control type="text" name="regija" required />
                </Form.Group>

                <Form.Group controlId="mjesto" className="mb-3">
                    <Form.Label>MJESTO</Form.Label>
                    <Form.Control type="text" name="mjesto" required />
                </Form.Group>

                <Form.Group controlId="zupanija" className="mb-3">
                    <Form.Label>ŽUPANIJA</Form.Label>
                    <Form.Control type="text" name="zupanija" required />
                </Form.Group>

                <Form.Group controlId="posta" className="mb-3">
                    <Form.Label>POŠTANSKI BROJ</Form.Label>
                    <Form.Control type="number" name="posta" required />
                </Form.Group>

                <Form.Group controlId="datumOdrzavanja">
                    <Form.Label>DATUM ODRŽAVANJA</Form.Label>
                    <Form.Control type="date" name="datumOdrzavanja" required></Form.Control>
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.LOKACIJE} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col className="text-end">
                        <Button type="submit" variant="success">
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}