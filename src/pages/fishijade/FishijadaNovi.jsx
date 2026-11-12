import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row, Container } from "react-bootstrap"
import FishijadaService from "../../services/FishijadaService"
import useBreakpoint from "../../hooks/useBreakpoint"

export default function FishijadaNovi() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
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
        <Container className="px-2 px-md-3">
            <h3 className="my-3 fs-4 fs-md-3">
                Dodavanje nove fišijade
            </h3>

            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="naziv" className="mb-3">
                    <Form.Label>NAZIV</Form.Label>
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>

                <Form.Group controlId="mjestoOdrzavanja" className="mb-3">
                    <Form.Label>ADRESA:</Form.Label>
                    <Form.Control type="text" name="mjestoOdrzavanja" required />
                </Form.Group>

                <Form.Group controlId="kotizacija" className="mb-3">
                    <Form.Label>KOTIZACIJA (€)</Form.Label>
                    <Form.Control type="number" name="kotizacija" step={1} required />
                </Form.Group>

                <Form.Group controlId="datumPokretanja" className="mb-3">
                    <Form.Label>DATUM ODRŽAVANJA</Form.Label>
                    <Form.Control type="date" name="datumPokretanja" required />
                </Form.Group>

                <Form.Group controlId="aktivan" className="mb-3">
                    <Form.Check label="Aktivan" name="aktivan" />
                </Form.Group>

                <Row className={`mt-4 ${jeMobitel ? 'flex-column gap-2' : ''}`}>
                    <Col xs={12} md={6}>
                        <Link to={RouteNames.FISHIJADE} className="btn btn-danger w-100">
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