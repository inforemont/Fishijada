import { useState } from "react"
import { Container, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import AuthService from "../../services/logiranje/AuthService"

import pandaHappy from "../../assets/pandahappy.gif"
import pandaMad from "../../assets/pandamad.gif"

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: "",
        lozinka: ""
    })

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [greskaServera, setGreskaServera] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = (currentForm) => {
        const newErrors = {}

        const emailTrim = currentForm.email.trim()
        if (emailTrim.length > 0) {
            if (emailTrim.length < 6) {
                newErrors.email = "E-mail mora imati najmanje 6 znakova (npr. nesto@gmail.com)."
            } else if (!emailTrim.includes('@')) {
                newErrors.email = "E-mail adresa mora sadržavati znak '@'."
            } else if (!emailTrim.includes('.')) {
                newErrors.email = "E-mail adresa mora sadržavati valjanu ekstenziju (npr. .hr, .com)."
            }
        }

        const lozinkaVal = currentForm.lozinka
        if (lozinkaVal.length > 0 && lozinkaVal.length < 8) {
            newErrors.lozinka = "Lozinka mora imati najmanje 8 znakova."
        }

        return newErrors
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        const updatedForm = { ...form, [name]: value }
        setForm(updatedForm)
        setTouched(prev => ({ ...prev, [name]: true }))

        const liveErrors = validateForm(updatedForm)
        setErrors(liveErrors)
    }

    const handleBlur = (e) => {
        const { name } = e.target
        setTouched(prev => ({ ...prev, [name]: true }))
    }

    const obradiPrijavu = async (e) => {
        e.preventDefault()
        setGreskaServera("")

        setTouched({
            email: true,
            lozinka: true
        })

        const allErrors = validateForm(form)

        if (!form.email.trim()) allErrors.email = "E-mail je obavezna stavka."
        if (!form.lozinka) allErrors.lozinka = "Lozinka je obavezna stavka."

        setErrors(allErrors)

        if (Object.keys(allErrors).length > 0) {
            return
        }

        setIsSubmitting(true)

        try {
            const korisnik = await AuthService.prijava({ email: form.email, lozinka: form.lozinka })

            if (korisnik) {
                window.dispatchEvent(new Event("authPromjena"))
                navigate(RouteNames.HOME)
            }
        } catch (err) {
            setGreskaServera("Neispravan e-mail ili lozinka.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const imaGresaka = Object.keys(touched).some(key => errors[key]) || !!greskaServera

    return (
        <Container className="d-flex justify-content-center align-items-center my-5">
            <style>
                {`
                    @keyframes skakanjeVratolomije {
                        0% { transform: translateY(0px) rotate(0deg); }
                        25% { transform: translateY(-8px) rotate(-2deg); }
                        50% { transform: translateY(0px) rotate(0deg); }
                        75% { transform: translateY(-4px) rotate(2deg); }
                        100% { transform: translateY(0px) rotate(0deg); }
                    }
                    .skacuci-naslov {
                        display: inline-block;
                        animation: skakanjeVratolomije 2.5s infinite ease-in-out;
                    }
                `}
            </style>

            <Card className="shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "480px", width: "100%" }}>
                <Card.Body>
                    <div className="text-center mb-3">
                        {imaGresaka ? (
                            <div>
                                <img
                                    src={pandaMad}
                                    alt="Panda razbija sve"
                                    style={{ width: "190px", height: "140px", objectFit: "cover", borderRadius: "8px" }}
                                    className="shadow-sm border border-danger mb-2"
                                />
                                <div className="text-danger fw-bold" style={{ fontSize: "11px" }}>Panda razbija sve! 🐼💥</div>
                            </div>
                        ) : (
                            <div>
                                <img
                                    src={pandaHappy}
                                    alt="Sretna panda"
                                    style={{ width: "190px", height: "140px", objectFit: "cover", borderRadius: "8px" }}
                                    className="shadow-sm border border-success mb-2"
                                />
                                <div className="text-success fw-bold" style={{ fontSize: "11px" }}>Sve je super! 🐼😊</div>
                            </div>
                        )}
                    </div>

                    <div className="text-center mb-3">
                        <h3 className="fw-bold text-dark fs-2 skacuci-naslov m-0">Prijava u sustav</h3>
                    </div>

                    <p className="text-muted text-center small mb-4">
                        Unesite podatke za upravljanje prijavama i fišijadama
                    </p>

                    {greskaServera && (
                        <Alert variant="danger" className="py-2 small text-center fw-semibold mb-3">
                            ⚠️ {greskaServera}
                        </Alert>
                    )}

                    <Form onSubmit={obradiPrijavu} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">E-mail adresa</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="nesto@gmail.com"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.email && !!errors.email}
                                isValid={touched.email && !errors.email && form.email.trim().length > 0}
                            />
                            {touched.email && errors.email && (
                                <div className="text-danger fw-semibold small mt-1">
                                    {errors.email}
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold small">Lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                name="lozinka"
                                placeholder="••••••••"
                                value={form.lozinka}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.lozinka && !!errors.lozinka}
                                isValid={touched.lozinka && !errors.lozinka && form.lozinka.length >= 8}
                            />
                            <Form.Text className="text-muted small d-block mt-1">
                                Lozinka mora imati najmanje 8 znakova.
                            </Form.Text>
                            {touched.lozinka && errors.lozinka && (
                                <div className="text-danger fw-semibold small mt-1">
                                    {errors.lozinka}
                                </div>
                            )}
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100 fw-bold py-2 rounded-pill shadow-sm" disabled={isSubmitting}>
                            {isSubmitting ? 'Prijava u tijeku...' : 'Prijavi se'}
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