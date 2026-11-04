import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import FishijadaService from "../../services/FishijadaService";

export default function FishijadaNovi() {
    const navigate = useNavigate()

    async function dodaj(fishijada){
        await FishijadaService.dodaj(fishijada).then(()=>{
            navigate(RouteNames.FISHIJADE)
        })
    }

    function obradiSubmit(e){
        e.preventDefault() 
        const podaci = new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv'),
            mjestoOdrzavanja: podaci.get('mjestoOdrzavanja'),
            cijena: parseFloat(podaci.get('kotizacija')),
            datumPokretanja: new Date(podaci.get('datumPokretanja')).toISOString(),
            aktivan: podaci.get('aktivan') === 'on',
            lokacije: []
        })
    }

    return (
        <>
            <h3 className="my-3">
                Dodavanje nove fišijade
            </h3>

            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="naziv" className="mb-3">
                    <Form.Label>NAZIV</Form.Label>
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>

                <Form.Group controlId="mjestoOdrzavanja" className="mb-3">
                    <Form.Label>MJESTO ODRŽAVANJA</Form.Label>
                    <Form.Control type="text" name="mjestoOdrzavanja" required />
                </Form.Group>

                <Form.Group controlId="kotizacija" className="mb-3">
                    <Form.Label>KOTIZACIJA (€)</Form.Label>
                    <Form.Control type="number" name="kotizacija" step={1} required />
                </Form.Group>

                <Form.Group controlId="datumPokretanja" className="mb-3">
                    <Form.Label>DATUM POKRETANJA</Form.Label>
                    <Form.Control type="date" name="datumPokretanja" required />
                </Form.Group>

                <Form.Group controlId="aktivan" className="mb-3">
                    <Form.Check label="Aktivan" name="aktivan" />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.FISHIJADE} className="btn btn-danger">
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