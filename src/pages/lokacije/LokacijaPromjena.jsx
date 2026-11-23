import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row, Container, Modal } from "react-bootstrap"
import LokacijaService from "../../services/lokacije/LokacijaService"
import useBreakpoint from "../../hooks/useBreakpoint"
import { useEffect, useState } from "react"

export default function LokacijaPromjena() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'

    const navigate = useNavigate()
    const params = useParams()

    const [lokacija, setLokacija] = useState({})
    const [uspjehModal, setUspjehModal] = useState(false)

    async function ucitajLokacije() {
        await LokacijaService.getBySifra(params.sifra).then((odgovor) => {
            const s = odgovor.data
            if (s && s.datumOdrzavanja) {
                s.datumOdrzavanja = s.datumOdrzavanja.substring(0, 10)
            }
            setLokacija(s || {})
        })
    }

    useEffect(() => {
        ucitajLokacije()
    }, [])

    async function promjeni(lokacijaPodaci) {
        try {
            await LokacijaService.promjeni(params.sifra, lokacijaPodaci)
            
            setUspjehModal(true)

            setTimeout(() => {
                setUspjehModal(false)
                navigate(RouteNames.LOKACIJE)
            }, 2000)
        } catch (err) {
            console.error("Greška kod promjene lokacije:", err)
            alert("Došlo je do greške prilikom spremanja podataka.")
        }
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const formElement = e.target
        
        if (!formElement.checkValidity()) {
            formElement.reportValidity()
            return
        }

        const podaci = new FormData(formElement)
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

            <Form onSubmit={obradiSubmit} noValidate>
                <Form.Group controlId="regija" className="mb-3">
                    <Form.Label>REGIJA</Form.Label>
                    <Form.Control type="text" name="regija" required
                        defaultValue={lokacija.regija || ''} />
                </Form.Group>

                <Form.Group controlId="mjesto" className="mb-3">
                    <Form.Label>MJESTO</Form.Label>
                    <Form.Control type="text" name="mjesto" required
                        defaultValue={lokacija.mjesto || ''} />
                </Form.Group>

                <Form.Group controlId="posta" className="mb-3">
                    <Form.Label>POŠTA</Form.Label>
                    <Form.Control type="number" name="posta" required
                        defaultValue={lokacija.posta || ''} />
                </Form.Group>

                <Form.Group controlId="zupanija" className="mb-3">
                    <Form.Label>ŽUPANIJA</Form.Label>
                    <Form.Control type="text" name="zupanija" required
                        defaultValue={lokacija.zupanija || ''} />
                </Form.Group>

                <Form.Group controlId="datumOdrzavanja" className="mb-3">
                    <Form.Label>DATUM ODRŽAVANJA</Form.Label>
                    <Form.Control type="date" name="datumOdrzavanja" required
                        defaultValue={lokacija.datumOdrzavanja || ''} />
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

            <Modal show={uspjehModal} centered backdrop="static">
                <Modal.Body className="text-center py-5 bg-white rounded-4 shadow-lg">
                    <div className="mb-3" style={{ fontSize: "3rem" }}>✨🎉</div>
                    <h4 className="fw-bold text-success mb-2">Uspješno promijenjeno!</h4>
                    <p className="text-muted mb-0">Podaci o lokaciji su uspješno ažurirani. Preusmjeravanje...</p>
                </Modal.Body>
            </Modal>
        </Container>
    )
}