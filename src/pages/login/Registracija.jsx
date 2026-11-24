import { useState } from "react"
import { Container, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"
import { RouteNames } from "../../constants"
import KorisnikService from "../../services/logiranje/KorisnikService"

import pandaHappy from "../../assets/pandahappy.gif"

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
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const obradiRegistraciju = async (e) => {
        e.preventDefault()
        setGreska("")
        setPoruka("")

        if (!form.ime.trim() || !form.email.trim() || !form.lozinka) {
            setGreska("Molimo ispunite sva obavezna polja.")
            return
        }

        if (form.lozinka.length < 8) {
            setGreska("Lozinka mora imati najmanje 8 znakova.")
            return
        }

        setIsSubmitting(true)

        try {

            await KorisnikService.dodaj({
                ime: form.ime.trim(),
                prezime: form.prezime.trim(),
                email: form.email.trim(),
                lozinka: form.lozinka,
                uloga: 'Korisnik'
            })

            setPoruka("Uspješna registracija! Možete se prijaviti u sustav.")
            setTimeout(() => {
                navigate(RouteNames.LOGIN)
            }, 1500)
        } catch (err) {
            setGreska(err.message || "Greška prilikom registracije u sustav.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center my-5">
            <Card className="shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "450px", width: "100%" }}>
                <Card.Body>
                    <div className="text-center mb-3">
                        <img 
                            src={pandaHappy} 
                            alt="Sretna panda" 
                            style={{ width: "150px", height: "110px", objectFit: "cover", borderRadius: "8px" }}
                            className="shadow-sm border border-success mb-2"
                        />
                    </div>

                    <h3 className="fw-bold text-center mb-2">Registracija računa</h3>
                    <p className="text-muted text-center small mb-4">
                        Stvorite novi korisnički račun za sudjelovanje
                    </p>

                    {poruka && <Alert variant="success" className="py-2 small text-center">{poruka}</Alert>}
                    {greska && <Alert variant="danger" className="py-2 small text-center">{greska}</Alert>}

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
                            <Form.Text className="text-muted small">
                                Minimalno 8 znakova.
                            </Form.Text>
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100 fw-bold py-2 rounded-pill shadow-sm" disabled={isSubmitting}>
                            {isSubmitting ? 'Registracija u tijeku...' : 'Registriraj se'}
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