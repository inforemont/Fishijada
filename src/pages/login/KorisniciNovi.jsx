import { useState } from "react"
import { Container, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"
import { RouteNames } from "../../constants"
import KorisnikService from "../../services/logiranje/KorisnikService"
import ShemaKorisnik from "../../schemas/ShemaKorisnik"

export default function KorisnikNovi() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        ime: '',
        prezime: '',
        email: '',
        lozinka: '',
        uloga: 'Korisnik'
    })

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [greskaServera, setGreskaServera] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = (currentForm) => {
        const result = ShemaKorisnik.safeParse(currentForm)
        if (result.success) {
            return {}
        }
        const newErrors = {}
        result.error.issues.forEach((issue) => {
            const fieldName = issue.path[0]
            if (!newErrors[fieldName]) {
                newErrors[fieldName] = issue.message
            }
        })
        return newErrors
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        const updatedForm = { ...form, [name]: value }
        setForm(updatedForm)
        setTouched(prev => ({ ...prev, [name]: true }))
        setErrors(validateForm(updatedForm))
    }

    const handleBlur = (e) => {
        const { name } = e.target
        setTouched(prev => ({ ...prev, [name]: true }))
    }

    const obradiSubmit = async (e) => {
        e.preventDefault()
        setGreskaServera("")

        setTouched({
            ime: true,
            prezime: true,
            email: true,
            lozinka: true,
            uloga: true
        })

        const allErrors = validateForm(form)
        if (!form.ime.trim()) allErrors.ime = "Ime je obavezno."
        if (!form.prezime.trim()) allErrors.prezime = "Prezime je obavezno."
        
        setErrors(allErrors)
        if (Object.keys(allErrors).length > 0) return

        setIsSubmitting(true)

        try {
            await KorisnikService.dodaj({
                ime: form.ime.trim(),
                prezime: form.prezime.trim(),
                email: form.email.trim(),
                lozinka: form.lozinka,
                uloga: form.uloga
            })
            navigate(RouteNames.KORISNICI)
        } catch (err) {
            setGreskaServera(err.message || "Greška prilikom dodavanja korisnika.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const imaGresaka = Object.keys(touched).some(key => errors[key]) || !!greskaServera

    return (
        <Container className="d-flex justify-content-center align-items-center my-4">
            <Card className="shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <Card.Body>
                    <h3 className="fw-bold text-center mb-2">Dodavanje novog korisnika</h3>
                    <p className="text-muted text-center small mb-4">
                        Administrator kreira novi korisnički račun u sustavu
                    </p>

                    {greskaServera && (
                        <Alert variant="danger" className="py-2 small text-center fw-semibold mb-3">
                            ⚠️ {greskaServera}
                        </Alert>
                    )}

                    <Form onSubmit={obradiSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">Ime</Form.Label>
                            <Form.Control
                                type="text"
                                name="ime"
                                placeholder="Unesite ime"
                                value={form.ime}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.ime && !!errors.ime}
                            />
                            {touched.ime && errors.ime && (
                                <div className="text-danger fw-semibold small mt-1">{errors.ime}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                name="prezime"
                                placeholder="Unesite prezime"
                                value={form.prezime}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.prezime && !!errors.prezime}
                            />
                            {touched.prezime && errors.prezime && (
                                <div className="text-danger fw-semibold small mt-1">{errors.prezime}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">E-mail adresa</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="ime@primjer.hr"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.email && !!errors.email}
                            />
                            {touched.email && errors.email && (
                                <div className="text-danger fw-semibold small mt-1">{errors.email}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">Lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                name="lozinka"
                                placeholder="••••••••"
                                value={form.lozinka}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.lozinka && !!errors.lozinka}
                            />
                            <Form.Text className="text-muted small d-block mt-1">
                                Min. 8 znakova, veliko slovo, malo slovo, broj i znak.
                            </Form.Text>
                            {touched.lozinka && errors.lozinka && (
                                <div className="text-danger fw-semibold small mt-1">{errors.lozinka}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold small">Uloga</Form.Label>
                            <Form.Select
                                name="uloga"
                                value={form.uloga}
                                onChange={handleChange}
                            >
                                <option value="Korisnik">Korisnik</option>
                                <option value="Admin">Admin</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Link to={RouteNames.KORISNICI} className="btn btn-outline-secondary w-50 rounded-pill py-2">
                                Odustani
                            </Link>
                            <Button variant="success" type="submit" className="w-50 fw-bold py-2 rounded-pill shadow-sm" disabled={isSubmitting}>
                                {isSubmitting ? 'Spremanje...' : 'Spremi korisnika'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}