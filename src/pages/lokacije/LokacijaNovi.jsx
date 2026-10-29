import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import LokacijaService from "../../services/lokacije/LokacijaService";



export default function LokacijaNovi() {

    const navigate = useNavigate()

    async function dodaj(lokacija){
        await LokacijaService.dodaj(lokacija).then(()=>{
            navigate(RouteNames.LOKACIJE)
        })
    }

    function obradiSubmit(e){
        e.preventDefault() 
        const podaci = new FormData(e.target)


                if(!podaci.get('regija')|| podaci.get('regija').trim().length===0){
            alert("Regija je obavezna i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('regija').trim().length<3 || podaci.get('regija').trim().length>30){
            alert("Regija mora sadržavati između 3 i 30 znakova")
            return 0
        }

                if(!podaci.get('mjesto')|| podaci.get('mjesto').trim().length===0){
            alert("Mjesto održavanja je obavezno i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('mjesto').trim().length<3 || podaci.get('mjesto').trim().length>30){
            alert("Mjesto održavanja mora sadržavati između 3 i 30 znakova")
            return 0
        }

        if(!podaci.get('zupanija')|| podaci.get('zupanija').trim().length===0){
            alert("Županija je obavezna i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('zupanija').trim().length<3 || podaci.get('zupanija').trim().length>30){
            alert("Županija mora sadržavati između 3 i 30 znakova")
            return 0
        }

        if (isNaN(podaci.get('posta'))|| podaci.get('posta')<10000 || podaci.get('posta')>53297){
            alert("Broj poštanskog ureda nije valjan")
            return
        }
        if(!podaci.get('posta')|| podaci.get('posta')===""){
            alert("Poštanski ured je obavezna stavka")
            return 0
        }

       
        dodaj({
            regija: podaci.get('regija'),
            mjesto:podaci.get('mjesto'),
            zupanija:podaci.get('zupanija'),
            posta: parseFloat(podaci.get('posta')),

        })
    }


    return (
        <>
            <h3 className="my-3">
                Dodavanje nove lokacije
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="regija">
                    <Form.Label>REGIJA</Form.Label>
                    <Form.Control type="text" name="regija" required />
                </Form.Group>

                <Form.Group controlId="mjesto">
                    <Form.Label>MJESTO</Form.Label>
                    <Form.Control type="text" name="mjesto" />
                </Form.Group>

                <Form.Group controlId="zupanija">
                    <Form.Label>ŽUPANIJA</Form.Label>
                    <Form.Control type="text" name="zupanija" />
                </Form.Group>

                <Form.Group controlId="posta">
                    <Form.Label>POŠTANSKI BROJ</Form.Label>
                <Form.Control type="number" name="posta" />
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
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>


        </>
    )
}