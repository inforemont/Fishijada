import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row, Container } from "react-bootstrap"
import FishijadaService from "../../services/FishijadaService"
import useBreakpoint from "../../hooks/useBreakpoint"
import { useEffect, useState } from "react"

export default function FishijadaPromjena() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'

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
            mjestoOdrzavanja: podaci.get('mjestoOdrzavanja'),
            cijena: parseFloat(podaci.get('kotizacija')),
            datumPokretanja: new Date(podaci.get('datumPokretanja')).toISOString(),
            aktivan: podaci.get('aktivan') === 'on'
        })
    }

    return (
        <Container className="px-2 px-md-3">
            <h3 className="my-3 fs-4 fs-md-3">
                Promjena fišijade
            </h3>

            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="naziv" className="mb-3">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required 
                    defaultValue={fishijada.naziv}/>
                </Form.Group>

                <Form.Group controlId="mjestoOdrzavanja" className="mb-3">
                    <Form.Label>Mjesto održavanja</Form.Label>
                    <Form.Control type="text" name="mjestoOdrzavanja" 
                    defaultValue={fishijada.mjestoOdrzavanja} />
                </Form.Group>

                <Form.Group controlId="kotizacija" className="mb-3">
                    <Form.Label>Kotizacija</Form.Label>
                    <Form.Control type="number" name="kotizacija" step={1} 
                    defaultValue={fishijada.cijena}/>
                </Form.Group>

                <Form.Group controlId="datumPokretanja" className="mb-3">
                    <Form.Label>Datum pokretanja</Form.Label>
                    <Form.Control type="date" name="datumPokretanja"
                    defaultValue={fishijada.datumPokretanja} />
                </Form.Group>

                <Form.Group controlId="aktivan" className="mb-3">
                    <Form.Check label="Aktivan" name="aktivan"
                    checked={aktivan}
                    onChange={(e)=>{setAktivan(e.target.checked)}} />
                </Form.Group>

                <Row className={`mt-4 ${jeMobitel ? 'flex-column gap-2' : ''}`}>
                    <Col xs={12} md={2}>
                        <Link to={RouteNames.FISHIJADE} className="btn btn-primary w-100">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={12} md={6} className={jeMobitel ? 'd-flex flex-column gap-2' : 'text-end'}>
                        <Button type="submit" variant="success" className={jeMobitel ? "w-100 mb-0" : "me-2"}>
                            Promjeni
                        </Button>
                        <Button variant="danger" onClick={()=>obrisi(params.sifra)} className={jeMobitel ? "w-100" : ""}>
                            Obriši
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}