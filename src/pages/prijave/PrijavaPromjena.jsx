import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import FishijadaService from "../../services/FishijadaService";
import { useEffect, useState } from "react";


export default function FishijadaPromjena() {



    const navigate = useNavigate()
    const params = useParams()
    const [fishijada, setFishijada] = useState({})
    const [aktivan, setAktivan] = useState(false)

    async function ucitajFishijadu(){
        await FishijadaService.getBySifra(params.sifra).then((odgovor)=>{
           const s = odgovor.data
           s.datumPokretanja = s.datumPokretanja.substring(0,10)
           setFishijada(s)
           setAktivan(s.aktivan)
        })
    }

    useEffect(()=>{
        ucitajFishijadu()
    },[])

    

    async function promjeni(sifra, fishijada){
        await FishijadaService.promjeni(sifra, fishijada).then(()=>{
            navigate(RouteNames.FISHIJADE)
        })
    }

    async function obrisi(sifra) {
    if (!confirm('Sigurno obrisati?')) {
        return;
    }

    await FishijadaService.obrisi(sifra);
    navigate(RouteNames.FISHIJADE);
}

    function obradiSubmit(e){
        e.preventDefault() 
        const podaci = new FormData(e.target)
        promjeni(params.sifra, {
            sifra: parseInt(params.sifra),
            naziv: podaci.get('naziv'),
            mjestoOdrzavanja:podaci.get('mjestoOdrzavanja'),
            cijena: parseFloat(podaci.get('kotizacija')),
            datumPokretanja: new Date(podaci.get('datumPokretanja')).toISOString(),
            aktivan: podaci.get('aktivan') === 'on'
        })

    }


    return (
        <>
            <h3>
                Promjena fishijade
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required 
                    defaultValue={fishijada.naziv}/>
                </Form.Group>

                <Form.Group controlId="mjestoOdrzavanja">
                    <Form.Label>Mjesto održavanja</Form.Label>
                    <Form.Control type="text" name="mjestoOdrzavanja" 
                    defaultValue={fishijada.mjestoOdrzavanja} />
                </Form.Group>

                <Form.Group controlId="kotizacija">
                    <Form.Label>Kotizacija</Form.Label>
                    <Form.Control type="number" name="kotizacija" step={1} 
                    defaultValue={fishijada.cijena}/>
                </Form.Group>

                <Form.Group controlId="datumPokretanja">
                    <Form.Label>Datum pokretanja</Form.Label>
                    <Form.Control type="date" name="datumPokretanja"
                    defaultValue={fishijada.datumPokretanja} />
                </Form.Group>

                <Form.Group controlId="aktivan" className="mt-3">
                    <Form.Check label="Aktivan" name="aktivan"
                    checked={aktivan}
                    onChange={(e)=>{setAktivan(e.target.checked)}} />

                </Form.Group>


                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.FISHIJADE}
                        className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success" className="me-2">
                            Promjeni
                        </Button>

                        &nbsp;&nbsp;&nbsp;
                         <Button variant="danger" onClick={()=>obrisi(params.sifra)}>
                                    Obriši
                        </Button>
                    </Col>
                </Row>
            </Form>


        </>
    )
}
