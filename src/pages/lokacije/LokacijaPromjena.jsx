import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import LokacijaService from "../../services/lokacije/LokacijaService";
import { useEffect, useState } from "react";




export default function LokacijaPromjena() {

    const navigate = useNavigate()
    const params=useParams()

    const [lokacija,setLokacija]=useState({})

    async function ucitajLokacije(){
        await LokacijaService.getBySifra(params.sifra).then((odgovor)=>{
            setLokacija(odgovor.data)
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
            mjesto:podaci.get('mjesto'),
            posta: parseInt(podaci.get('posta')),
            zupanija:podaci.get('zupanija'),

        })
    }


    return (
        <>
            <h3 className="my-3">
                Promijeni lokaciju
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="regija">
                    <Form.Label>REGIJA</Form.Label>
                    <Form.Control type="text" name="regija" required 
                    defaultValue={lokacija.regija}/>
                </Form.Group>

                <Form.Group controlId="mjesto">
                    <Form.Label>MJESTO</Form.Label>
                    <Form.Control type="text" name="mjesto" required
                    defaultValue={lokacija.mjesto} />
                </Form.Group>

                <Form.Group controlId="posta">
                    <Form.Label>POŠTA</Form.Label>
                    <Form.Control type="number" name="posta" required
                    defaultValue={lokacija.posta} />
                </Form.Group>

                <Form.Group controlId="zupanija">
                    <Form.Label>ŽUPANIJA</Form.Label>
                    <Form.Control type="text" name="zupanija" required
                    defaultValue={lokacija.zupanija} />
                </Form.Group>


                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.LOKACIJE}
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