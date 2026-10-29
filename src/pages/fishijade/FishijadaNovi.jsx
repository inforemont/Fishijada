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

        if(!podaci.get('naziv')|| podaci.get('naziv').trim().length===0){
            alert("Naziv je obavezan i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('naziv').trim().length<3 || podaci.get('naziv').trim().length>30){
            alert("Naziv mora sadržavati između 3 i 30 znakova")
            return 0
        }

                if(!podaci.get('mjestoOdrzavanja')|| podaci.get('mjestoOdrzavanja').trim().length===0){
            alert("Mjesto održavanja je obavezno i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('mjestoOdrzavanja').trim().length<3 || podaci.get('mjestoOdrzavanja').trim().length>30){
            alert("Mjesto održavanja mora sadržavati između 3 i 30 znakova")
            return 0
        }

        if (isNaN(podaci.get('kotizacija'))|| podaci.get('kotizacija')<30 || podaci.get('kotizacija')>100){
            alert("Kotizacija ne može biti manja od 30 eura niti veća od 100 eura")
            return
        }
        if(!podaci.get('kotizacija')|| podaci.get('kotizacija')===""){
            alert("Kotizacija je obavezna stavka")
            return 0
        }

        if(!podaci.get(datumPokretanja)|| podaci.get('datumPokretanja')===""){
            alert("Datum je obavezan")
            return
        }

        const odabraniDatum=new Date (podaci.get('datumPokretanja'))
        const danas=new Date()
        danas.setHours(0,0,0,0)

        if(odabraniDatum<danas){
            alert("Datum ne može biti u prošlosti")
            return
        }


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