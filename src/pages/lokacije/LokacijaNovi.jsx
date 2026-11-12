import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row, Container } from "react-bootstrap";
import LokacijaService from "../../services/lokacije/LokacijaService";
import useBreakpoint from "../../hooks/useBreakpoint"

export default function LokacijaNovi() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
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
        <Container className="px-2 px-md-3">
            <h3 className="my-3 fs-4 fs-md-3">
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

                <Form.Group controlId="datumOdrzavanja" className="mb-3">
                    <Form.Label>DATUM ODRŽAVANJA</Form.Label>
                    <Form.Control type="date" name="datumOdrzavanja" required></Form.Control>
                </Form.Group>

                <Row className={`mt-4 ${jeMobitel ? 'flex-column gap-2' : ''}`}>
                    <Col xs={12} md={6}>
                        <Link to={RouteNames.LOKACIJE} className="btn btn-danger w-100">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={12} md={6} className={jeMobitel ? '' : 'text-end'}>
                        <Button type="submit" variant="success" className="w-100">
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}