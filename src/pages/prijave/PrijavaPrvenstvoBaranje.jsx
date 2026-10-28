import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import PrijavaService from "../../services/prijave/PrijavaService";
import {fishijade} from"../../services/FishijadaPodaci";






export default function PrijavaPrvenstvoBaranje() {

    const navigate = useNavigate()


    async function dodaj(prijava){
        await PrijavaService.dodaj(prijava).then(()=>{
            navigate(RouteNames.PRIJAVE)
        })
    }


    function obradiSubmit(e){
        e.preventDefault() 
        const podaci = new FormData(e.target)
        dodaj({
            imePrezime: podaci.get('imePrezime'),
            ekipa:podaci.get('ekipa'),
            stol: podaci.get('stol') ? parseFloat(podaci.get('stol')) : 0,
            email:podaci.get('email'),
            kotizacijaPlacena: podaci.get('kotizacijaPlacena') === 'on',
            lokacija: 111,
            fishijada:111,
        })
    }



    return (
        <>
            <h3 className="my-3">
                Prijava za Prvenstvo Baranje u Belom Manastiru 
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="imePrezime">
                    <Form.Label>IME I PREZIME</Form.Label>
                    <Form.Control type="text" name="imePrezime" required />
                </Form.Group>

                <Form.Group controlId="ekipa">
                    <Form.Label>EKIPA</Form.Label>
                    <Form.Control type="text" name="ekipa" />
                </Form.Group>

                <Form.Group controlId="stol">
                    <Form.Label>STOL</Form.Label>
                    <Form.Control type="number" name="stol" />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" name="email" />
                </Form.Group>

                <Form.Group controlId="kotizacijaPlacena" className="mt-3">
                    <Form.Check label="Kotizacija uplaćena" name="kotizacijaPlacena" />
                </Form.Group>


                <Form.Group controlId="lokacija" className="mt-3">
                    <Form.Label>LOKACIJA</Form.Label>
                    <Form.Select 
                        name="lokacija"
                        required
                        defaultValue={111}
                       
                    >
                        {fishijade.filter(f=>f.sifra===111).map((l)=>(
                        <option key={l.sifra} value={l.sifra}>
                        {l.mjesto} ({l.regija})
                        </option>

                        ))}
                    </Form.Select>
                    </Form.Group>



                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.PRIJAVE}
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