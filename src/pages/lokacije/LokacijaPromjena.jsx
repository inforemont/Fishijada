import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row, Container } from "react-bootstrap"
import LokacijaService from "../../services/lokacije/LokacijaService"
import useBreakpoint from "../../hooks/useBreakpoint"
import { useEffect, useState } from "react"

export default function LokacijaPromjena() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'

    const navigate = useNavigate()
    const params = useParams()

    const [lokacija, setLokacija] = useState({})

    async function ucitajLokacije(){
        await LokacijaService.getBySifra(params.sifra).then((odgovor)=>{
            const s = odgovor.data
            if (s.datumOdrzavanja) {
                s.datumOdrzavanja = s.datumOdrzavanja.substring(0, 10)
            }
            setLokacija(s)
        })
    }

    useEffect(()=>{
        ucitajLokacije()
    },[])

    async function promjeni(lokacija){
        await LokacijaService.promjeni(params.sifra, lokacija).then(()=>{
            navigate(RouteNames.LOKACIJE)
        })
    }

    function obradiSubmit(e){
        e.preventDefault() 
        const podaci = new FormData(e.target)
        promjeni({
            regija: podaci.get('regija'),
            mjesto: podaci.get('mjesto'),
            posta: parseInt(podaci.get('posta')),
            zupanija: podaci.get('zupanija'),
            datumOdrzavanja: podaci.get('datumOdrzavanja'),
        })
    }

    return (
        <Container className="px-2 px-md-3">
            <h3 className="my-3 fs-4 fs-md-3">
                Promijeni lokaciju
            </h3>

            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="regija" className="mb-3">
                    <Form.Label>REGIJA</Form.Label>
                    <Form.Control type="text" name="regija" required 
                    defaultValue={lokacija.regija}/>
                </Form.Group>

                <Form.Group controlId="mjesto" className="mb-3">
                    <Form.Label>MJESTO</Form.Label>
                    <Form.Control type="text" name="mjesto" required
                    defaultValue={lokacija.mjesto} />
                </Form.Group>

                <Form.Group controlId="posta" className="mb-3">
                    <Form.Label>POŠTA</Form.Label>
                    <Form.Control type="number" name="posta" required
                    defaultValue={lokacija.posta} />
                </Form.Group>

                <Form.Group controlId="zupanija" className="mb-3">
                    <Form.Label>ŽUPANIJA</Form.Label>
                    <Form.Control type="text" name="zupanija" required
                    defaultValue={lokacija.zupanija} />
                </Form.Group>

                <Form.Group controlId="datumOdrzavanja" className="mb-3">
                    <Form.Label>DATUM ODRŽAVANJA</Form.Label>
                    <Form.Control type="date" name="datumOdrzavanja" required
                    defaultValue={lokacija.datumOdrzavanja} />
                </Form.Group>

                <Row className={`mt-4 ${jeMobitel ? 'flex-column gap-2' : ''}`}>
                    <Col xs={12} md={6}>
                        <Link to={RouteNames.LOKACIJE} className="btn btn-primary w-100">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={12} md={6} className={jeMobitel ? '' : 'text-end'}>
                        <Button type="submit" variant="success" className="w-100">
                            Promijeni
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}