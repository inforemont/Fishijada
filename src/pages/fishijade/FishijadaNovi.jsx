import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row, Container, Card } from "react-bootstrap";
import FishijadaService from "../../services/FishijadaService";


export default function FishijadaNovi() {

    const navigate = useNavigate()

    async function dodaj(fishijada) {
        await FishijadaService.dodaj(fishijada).then(() => {
            navigate(RouteNames.FISHIJADE)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv'),
            mjestoOdrzavanja: podaci.get('mjestoOdrzavanja'),
            cijena: parseFloat(podaci.get('kotizacija')),
            datumPokretanja: new Date(podaci.get('datumPokretanja')).toISOString(),
            aktivan: podaci.get('aktivan') === 'on'
        })
    }


    return (


        <Form onSubmit={obradiSubmit}>

            <Container className="mt-3">
                <Card style={{ padding: '1rem' }}>
                    <Card.Title className="mb-4">Dodavanje nove fišijade</Card.Title>

                    <Row className="mb-3">
                        <Col xs={12}>
                            <Form.Group controlID="naziv">
                                <Form.Label>Naziv</Form.Label>
                                <Form.Control type="text" name="naziv" required />
                            </Form.Group>
                        </Col>
                        </Row>
                        <Row className="mb-3">
                        <Col xs={6}>
                            <Form.Group controlID="mjestoOdrzavanja">
                                <Form.Label>Mjesto</Form.Label>
                                <Form.Control type="text" name="mjestoOdrzavanja" />
                            </Form.Group>
                        </Col>
                        <Col xs={6}>
                            <Form.Group controlID="kotizacija">
                                <Form.Label>Kotizacija</Form.Label>
                                <Form.Control type="number" style={{textAlign: 'right'}} name="kotizacija" step={0.01} />
                            </Form.Group>
                        </Col>
                        </Row>
                        <Row className="mb-4 align-items-center">
                        <Col xs={6}>
                            <Form.Group controlID="datumPokretanja" className="mb-1">
                                <Form.Label>Datum</Form.Label>
                                <Form.Control type="date"
                                onClick={(e)=>e.target.showPicker()}
                                onFocus={(e)=>e.target.showPicker()} 
                                name="datumPokretanja" />
                            </Form.Group>
                        </Col>
                        <Col xs={6} style={{marginTop: '0.7rem'} }>
                            <Form.Group controlId="aktivan" className="mb-1 mt-4 ">
                                <Form.Check label="Aktivan" name="aktivan" />
                            </Form.Group>
                        </Col>
                        </Row>

                        <Row className="mt-4">
                        <Col xs={6}>
                            <Link to={RouteNames.FISHIJADE}
                                className="btn btn-danger w-100">
                                Odustani
                            </Link>

                        </Col>

                        <Col xs={6}>
                            <Button type="submit" variant="success" style={{textAlign: 'center'}} className="w-100">
                                Dodaj
                            </Button>
                        </Col>



                    </Row>
                </Card>

            </Container>

        </Form>

    )
}