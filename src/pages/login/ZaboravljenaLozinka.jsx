import { useState } from "react"
import { Container, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import AuthService from "../../services/logiranje/AuthService"

export default function ZaboravljenaLozinka() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [poruka, setPoruka] = useState("")
    const [greska, setGreska] = useState("")

    const posaljiZahtjev = async (e) => {
        e.preventDefault()
        setGreska("")
        setPoruka("")

        try {
            await AuthService.zatraziResetLozinke(email)
            setPoruka("Uspješno! Provjerite vašu e-mail adresu za link za promjenu lozinke.")
        } catch (err) {
            console.error(err)
            setGreska("Došlo je do greške. Provjerite postoji li uneseni e-mail u sustavu.")
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: "70vh" }}>
            <Card className="shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "420px", width: "100%" }}>
                <Card.Body>
                    <h3 className="fw-bold text-center mb-2">Zaboravljena lozinka</h3>
                    <p className="text-muted text-center small mb-4">
                        Unesite Vaš e-mail i poslat ćemo Vam upute za oporavak lozinke.
                    </p>

                    {poruka && <Alert variant="success" className="py-2 small">{poruka}</Alert>}
                    {greska && <Alert variant="danger" className="py-2 small">{greska}</Alert>}

                    <Form onSubmit={posaljiZahtjev}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold small">E-mail adresa</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="ime@primjer.hr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 fw-bold py-2 rounded-pill shadow-sm mb-3">
                            Pošalji link za oporavak
                        </Button>

                        <div className="text-center">
                            <Button 
                                variant="link" 
                                className="text-decoration-none small text-muted"
                                onClick={() => navigate(RouteNames.LOGIN)}
                            >
                                Natrag na prijavu
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}