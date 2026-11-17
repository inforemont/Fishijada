import { useState } from "react"
import { Container, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function Registracija() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        ime: '',
        prezime: '',
        email: '',
        lozinka: '',
        uloga: 'Korisnik'
    })
    const [poruka, setPoruka] = useState("")
    const [greska, setGreska] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const obradiRegistraciju = (e) => {
        e.preventDefault()
        setGreska("")
        setPoruka("")

        if (!form.ime || !form.email || !form.lozinka) {
            setGreska("Molimo ispunite sva obavezna polja.")
            return
        }

        setPoruka("Uspješna registracija! Možete se prijaviti u sustav.")
        setTimeout(() => {
            navigate(RouteNames.LOGIN)
        }, 1500)
    }

    return (
        <Container className="d-flex justify-content-center align-items-center my-5">
            <Card className="shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "450px", width: "100%" }}>
                <Card.Body>
                    <h3 className="fw-bold text-center mb-2">Registracija računa</h3>
                    <p className="text-muted text-center small mb-4">
                        Stvorite novi korisnički račun za sudjelovanje
                    </p>

                    {poruka && <Alert variant="success" className="py-2 small">{poruka}</Alert>}
                    {greska && <Alert variant="danger" className="py-2 small">{greska}</Alert>}

                    <Form onSubmit={obradiRegistraciju}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">Ime</Form.Label>
                            <Form.Control
                                type="text"
                                name="ime"
                                placeholder="Unesite ime"
                                value={form.ime}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                name="prezime"
                                placeholder="Unesite prezime"
                                value={form.prezime}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">E-mail adresa</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="ime@primjer.hr"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold small">Lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                name="lozinka"
                                placeholder="••••••••"
                                value={form.lozinka}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100 fw-bold py-2 rounded-pill">
                            Registriraj se
                        </Button>
                    </Form>

                    <div className="text-center mt-3">
                        <span className="text-muted small">Već imate račun? </span>
                        <Link to={RouteNames.LOGIN} className="small text-decoration-none fw-semibold">
                            Prijavite se ovdje
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}