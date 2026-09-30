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
            mjesto:podaci.get('mjestoOdrzavanja'),
            kotizacija: parseFloat(podaci.get('kotizacija')),
            datumPokretanja: new Date(podaci.get('datumPokretanja')).toISOString(),
            aktivan: podaci.get('aktivan') === 'on'
        })
    }


    return (
        <>
            <h3 className="my-3">
                Dodavanje nove fišijade
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>

                <Form.Group controlId="mjestoOdrzavanja">
                    <Form.Label>Mjesto održavanja</Form.Label>
                    <Form.Control type="text" name="mjestoOdrzavanja" />
                </Form.Group>

                <Form.Group controlId="kotizacija">
                    <Form.Label>Kotizacija</Form.Label>
                    <Form.Control type="number" name="kotizacija" step={1} />
                </Form.Group>

                <Form.Group controlId="datumPokretanja">
                    <Form.Label>Datum pokretanja</Form.Label>
                    <Form.Control type="date" name="datumPokretanja" />
                </Form.Group>

                <Form.Group controlId="aktivan" className="mt-3">
                    <Form.Check label="Aktivan" name="aktivan" />
                </Form.Group>


                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.FISHIJADE}
                        className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>


        </>
    )
}