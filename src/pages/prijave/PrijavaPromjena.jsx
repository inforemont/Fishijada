import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import PrijavaService from "../../services/prijave/PrijavaService";
import { useEffect } from "react";



export default function PrijavaPromjena() {

    const navigate = useNavigate()
    const params=useParams()

    const [prijava,setPrijava]=useState({})

    async function ucitajPrijave(){
        await PrijavaService.getBySifra(params.sifra).then((odgovor)=>{
            setPrijava(odgovor.data)
        })

    }

    useEffect(()=>{
        ucitajPrijave()
    },[])

    async function promjeni(prijava){
        await PrijavaService.promjeni(params.sifra, prijava).then(()=>{
            navigate(RouteNames.PRIJAVE)
        })
    }

    function obradiSubmit(e){
        e.preventDefault() 
        const podaci = new FormData(e.target)
        promjeni({
            imePrezime: podaci.get('imePrezime'),
            ekipa:podaci.get('ekipa'),
            stol: parseFloat(podaci.get('stol')),
            email:podaci.get('email'),
            kotizacijaPlacena: podaci.get('kotizacijaPlacena') === 'on',
            prvenstvoHrvatske: podaci.get('prvenstvoHrvatske') === 'on',
        })
    }


    return (
        <>
            <h3 className="my-3">
                Promijeni prijavu
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="imePrezime">
                    <Form.Label>IME I PREZIME</Form.Label>
                    <Form.Control type="text" name="imePrezime" required 
                    defaultValue={prijava.imePrezime}/>
                </Form.Group>

                <Form.Group controlId="ekipa">
                    <Form.Label>EKIPA</Form.Label>
                    <Form.Control type="text" name="ekipa" required
                    defaultValue={prijava.ekipa} />
                </Form.Group>

                <Form.Group controlId="stol">
                    <Form.Label>STOL</Form.Label>
                    <Form.Control type="number" name="stol" required
                    defaultValue={prijava.stol} />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" name="email" required
                    defaultValue={prijava.email} />
                </Form.Group>

                <Form.Group controlId="kotizacijaPlacena" className="mt-3">
                    <Form.Check label="Kotizacija uplaćena" name="kotizacijaPlacena" 
                    defaultValue={prijava.kotizacijaPlacena} />
                </Form.Group>
                 <Form.Group controlId="prvenstvoHrvatske" className="mt-3">
                    <Form.Check label="Prvenstvo Hrvatske" name="prvenstvoHrvatske" 
                    defaultValue={prijava.prvenstvoHrvatske}/>
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
                            Promijeni
                        </Button>
                    </Col>
                </Row>
            </Form>


        </>
    )
}