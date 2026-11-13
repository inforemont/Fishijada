import { useState } from "react"
import { Container, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [lozinka, setLozinka] = useState("")
    const [greska, setGreska] = useState("")

    const obradiPrijavu = (e) => {
        e.preventDefault()

        if (!email || !lozinka) {
            setGreska("Molimo unesite e-mail i lozinku.")
            return
        }

        const korisnik = {
            ime: email.split("@")[0], 
            email: email,
            uloga: "Admin"
        }

        localStorage.setItem("prijavljeniKorisnik", JSON.stringify(korisnik))

        window.dispatchEvent(new Event("authPromjena"))
        navigate(RouteNames.HOME)
    }

    return (
        <Container className="d-flex justify-content-center align-items-center my-5">
            <Card className="shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "420px", width: "100%" }}>
                <Card.Body>
                    <h3 className="fw-bold text-center mb-2">Prijava u sustav</h3>
                    <p className="text-muted text-center small mb-4">
                        Unesite podatke za upravljanje prijavama i fišijadama
                    </p>

                    {greska && <Alert variant="danger" className="py-2 small">{greska}</Alert>}

                    <Form onSubmit={obradiPrijavu}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">E-mail adresa</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="ime@primjer.hr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold small">Lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="••••••••"
                                value={lozinka}
                                onChange={(e) => setLozinka(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100 fw-bold py-2 rounded-pill">
                            Prijavi se
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <span className="text-muted small">Zaboravili ste lozinku? </span>
                        <Button
                            variant="link"
                            className="p-0 small text-decoration-none fw-semibold"
                            onClick={() => navigate(RouteNames.ZABORAVLJENA_LOZINKA)}
                        >
                            Resetirajte ju ovdje
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}