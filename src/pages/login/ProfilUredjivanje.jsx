import { useState, useEffect } from "react"
import { Container, Card, Form, Button, Alert } from "react-bootstrap"
import AuthService from "../../services/logiranje/AuthService"

export default function ProfilUredivanje() {
    const [ime, setIme] = useState("")
    const [prezime, setPrezime] = useState("")
    const [staraLozinka, setStaraLozinka] = useState("")
    const [novaLozinka, setNovaLozinka] = useState("")
    const [poruka, setPoruka] = useState("")
    const [greska, setGreska] = useState("")

    useEffect(() => {
        const korisnik = AuthService.dohvatiPrijavljenogKorisnika()
        if (korisnik) {
            setIme(korisnik.ime || "")
            setPrezime(korisnik.prezime || "")
        }
    }, [])

    const spremiPromjene = async (e) => {
        e.preventDefault()
        setGreska("")
        setPoruka("")

        try {
            await AuthService.azurirajProfil({ ime, prezime, staraLozinka, novaLozinka })
            setPoruka("Profil i podaci uspješno su ažurirani!")
            setStaraLozinka("")
            setNovaLozinka("")
            window.dispatchEvent(new Event("authPromjena")) 
        } catch (err) {
            console.error(err)
            setGreska("Greška prilikom ažuriranja. Provjerite staru lozinku.")
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center my-5">
            <Card className="shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "480px", width: "100%" }}>
                <Card.Body>
                    <h3 className="fw-bold text-center mb-3">Uređivanje profila</h3>

                    {poruka && <Alert variant="success" className="py-2 small">{poruka}</Alert>}
                    {greska && <Alert variant="danger" className="py-2 small">{greska}</Alert>}

                    <Form onSubmit={spremiPromjene}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">Ime</Form.Label>
                            <Form.Control
                                type="text"
                                value={ime}
                                onChange={(e) => setIme(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                value={prezime}
                                onChange={(e) => setPrezime(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <hr className="my-4" />
                        <p className="text-muted small">Promjena lozinke (ispunite samo ako želite promijeniti lozinku):</p>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">Trenutna lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="••••••••"
                                value={staraLozinka}
                                onChange={(e) => setStaraLozinka(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold small">Nova lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="••••••••"
                                value={novaLozinka}
                                onChange={(e) => setNovaLozinka(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100 fw-bold py-2 rounded-pill shadow-sm">
                            Spremi promjene
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}