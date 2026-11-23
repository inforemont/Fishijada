import { useState, useEffect } from "react"
import { Container, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import AuthService from "../../services/logiranje/AuthService"
import useBreakpoint from "../../hooks/useBreakpoint"
import { ShemaProfilOsnovno, ShemaProfilLozinka } from "../../schemas/ShemaKorisnik"

import pandaHappy from "../../assets/pandahappy.gif"
import pandaMad from "../../assets/pandamad.gif"

export default function ProfilUredivanje() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const navigate = useNavigate()

    // Odvojena stanja za formu profila i formu lozinke
    const [formProfil, setFormProfil] = useState({ ime: "", prezime: "" })
    const [formLozinka, setFormLozinka] = useState({ staraLozinka: "", novaLozinka: "" })

    const [errorsProfil, setErrorsProfil] = useState({})
    const [errorsLozinka, setErrorsLozinka] = useState({})
    
    const [touchedProfil, setTouchedProfil] = useState({})
    const [touchedLozinka, setTouchedLozinka] = useState({})

    const [porukaProfil, setPorukaProfil] = useState("")
    const [greskaProfil, setGreskaProfil] = useState("")
    
    const [porukaLozinka, setPorukaLozinka] = useState("")
    const [greskaLozinka, setGreskaLozinka] = useState("")

    const [isSubmittingProfil, setIsSubmittingProfil] = useState(false)
    const [isSubmittingLozinka, setIsSubmittingLozinka] = useState(false)

    useEffect(() => {
        const korisnik = AuthService.dohvatiPrijavljenogKorisnika()
        if (korisnik) {
            setFormProfil({
                ime: korisnik.ime || "",
                prezime: korisnik.prezime || ""
            })
        }
    }, [])

    // Validacija za profil
    const validateProfil = (data) => {
        const result = ShemaProfilOsnovno.safeParse(data)
        if (result.success) return {}
        const newErrors = {}
        result.error.issues.forEach(issue => {
            newErrors[issue.path[0]] = issue.message
        })
        return newErrors
    }

    // Validacija za lozinku
    const validateLozinka = (data) => {
        const result = ShemaProfilLozinka.safeParse(data)
        if (result.success) return {}
        const newErrors = {}
        result.error.issues.forEach(issue => {
            newErrors[issue.path[0]] = issue.message
        })
        return newErrors
    }

    const handleProfilChange = (e) => {
        const { name, value } = e.target
        const updated = { ...formProfil, [name]: value }
        setFormProfil(updated)
        setTouchedProfil(prev => ({ ...prev, [name]: true }))
        setErrorsProfil(validateProfil(updated))
    }

    const handleLozinkaChange = (e) => {
        const { name, value } = e.target
        const updated = { ...formLozinka, [name]: value }
        setFormLozinka(updated)
        setTouchedLozinka(prev => ({ ...prev, [name]: true }))
        setErrorsLozinka(validateLozinka(updated))
    }

    // Spremanje samo imena i prezimena
    const spremiProfil = async (e) => {
        e.preventDefault()
        setGreskaProfil("")
        setPorukaProfil("")

        setTouchedProfil({ ime: true, prezime: true })
        const allErrors = validateProfil(formProfil)
        setErrorsProfil(allErrors)

        if (Object.keys(allErrors).length > 0) return

        setIsSubmittingProfil(true)
        try {
            await AuthService.azurirajProfil({
                ime: formProfil.ime.trim(),
                prezime: formProfil.prezime.trim()
            })
            setPorukaProfil("Ime i prezime uspješno su ažurirani!")
            window.dispatchEvent(new Event("authPromjena"))
        } catch (err) {
            console.error(err)
            setGreskaProfil("Greška prilikom ažuriranja profila.")
        } finally {
            setIsSubmittingProfil(false)
        }
    }

    // Spremanje samo lozinke
    const spremiLozinku = async (e) => {
        e.preventDefault()
        setGreskaLozinka("")
        setPorukaLozinka("")

        setTouchedLozinka({ staraLozinka: true, novaLozinka: true })
        const allErrors = validateLozinka(formLozinka)
        setErrorsLozinka(allErrors)

        if (Object.keys(allErrors).length > 0) return

        setIsSubmittingLozinka(true)
        try {
            await AuthService.azurirajProfil({
                ime: formProfil.ime.trim(),
                prezime: formProfil.prezime.trim(),
                staraLozinka: formLozinka.staraLozinka,
                lozinka: formLozinka.novaLozinka
            })
            setPorukaLozinka("Lozinka je uspješno promijenjena!")
            setFormLozinka({ staraLozinka: "", novaLozinka: "" })
            setTouchedLozinka({})
            window.dispatchEvent(new Event("authPromjena"))
        } catch (err) {
            console.error(err)
            setGreskaLozinka(err.message || "Greška prilikom promjene lozinke. Provjerite staru lozinku.")
        } finally {
            setIsSubmittingLozinka(false)
        }
    }

    // Ukupno grešaka za prikaz pande
    const imaGresaka = 
        Object.keys(touchedProfil).some(k => errorsProfil[k]) || 
        Object.keys(touchedLozinka).some(k => errorsLozinka[k])

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

            <Card className="shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "540px", width: "100%" }}>
                <Card.Body>
                    <div className="text-center mb-3">
                        {imaGresaka ? (
                            <div>
                                <img
                                    src={pandaMad}
                                    alt="Panda razbija sve"
                                    style={{ width: "170px", height: "130px", objectFit: "cover", borderRadius: "8px" }}
                                    className="shadow-sm border border-danger mb-1"
                                />
                                <div className="text-danger fw-bold" style={{ fontSize: "11px" }}>Panda razbija sve! 🐼💥</div>
                            </div>
                        ) : (
                            <div>
                                <img
                                    src={pandaHappy}
                                    alt="Sretna panda"
                                    style={{ width: "170px", height: "130px", objectFit: "cover", borderRadius: "8px" }}
                                    className="shadow-sm border border-success mb-1"
                                />
                                <div className="text-success fw-bold" style={{ fontSize: "11px" }}>Sve je super! 🐼😊</div>
                            </div>
                        )}
                    </div>

                    <div className="text-center mb-3">
                        <h3 className="fw-bold text-dark fs-2 skacuci-naslov m-0">Uređivanje profila</h3>
                    </div>

                    <Card className="p-3 mb-4 border bg-white shadow-sm">
                        <h5 className="fw-bold text-secondary fs-6 mb-3">Osnovni podaci</h5>

                        {porukaProfil && <Alert variant="success" className="py-2 small text-center">{porukaProfil}</Alert>}
                        {greskaProfil && <Alert variant="danger" className="py-2 small text-center">⚠️ {greskaProfil}</Alert>}

                        <Form onSubmit={spremiProfil} noValidate>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold small">Ime</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ime"
                                    value={formProfil.ime}
                                    onChange={handleProfilChange}
                                    isInvalid={touchedProfil.ime && !!errorsProfil.ime}
                                    isValid={touchedProfil.ime && !errorsProfil.ime && formProfil.ime.trim().length > 0}
                                />
                                {touchedProfil.ime && errorsProfil.ime && (
                                    <div className="text-danger fw-semibold small mt-1">{errorsProfil.ime}</div>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold small">Prezime</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="prezime"
                                    value={formProfil.prezime}
                                    onChange={handleProfilChange}
                                    isInvalid={touchedProfil.prezime && !!errorsProfil.prezime}
                                    isValid={touchedProfil.prezime && !errorsProfil.prezime && formProfil.prezime.trim().length > 0}
                                />
                                {touchedProfil.prezime && errorsProfil.prezime && (
                                    <div className="text-danger fw-semibold small mt-1">{errorsProfil.prezime}</div>
                                )}
                            </Form.Group>

                            <Button 
                                variant="success" 
                                type="submit" 
                                className="w-50 d-block mx-auto fw-bold py-2 rounded-pill shadow-sm"
                                disabled={isSubmittingProfil}
                            >
                                {isSubmittingProfil ? 'Spremanje imena...' : 'Spremi ime i prezime'}
                            </Button>
                        </Form>
                    </Card>
                    <Card className="p-3 mb-4 border bg-white shadow-sm">
                        <h5 className="fw-bold text-secondary fs-6 mb-2">Promjena lozinke</h5>
                        <p className="text-muted small">Min. 13 znakova, veliko slovo, malo slovo, broj i poseban znak.</p>

                        {porukaLozinka && <Alert variant="success" className="py-2 small text-center">{porukaLozinka}</Alert>}
                        {greskaLozinka && <Alert variant="danger" className="py-2 small text-center">⚠️ {greskaLozinka}</Alert>}

                        <Form onSubmit={spremiLozinku} noValidate>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold small">Trenutna lozinka</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="staraLozinka"
                                    placeholder="••••••••"
                                    value={formLozinka.staraLozinka}
                                    onChange={handleLozinkaChange}
                                    isInvalid={touchedLozinka.staraLozinka && !!errorsLozinka.staraLozinka}
                                    isValid={touchedLozinka.staraLozinka && !errorsLozinka.staraLozinka && formLozinka.staraLozinka.length > 0}
                                />
                                {touchedLozinka.staraLozinka && errorsLozinka.staraLozinka && (
                                    <div className="text-danger fw-semibold small mt-1">{errorsLozinka.staraLozinka}</div>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold small">Nova lozinka</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="novaLozinka"
                                    placeholder="••••••••"
                                    value={formLozinka.novaLozinka}
                                    onChange={handleLozinkaChange}
                                    isInvalid={touchedLozinka.novaLozinka && !!errorsLozinka.novaLozinka}
                                    isValid={touchedLozinka.novaLozinka && !errorsLozinka.novaLozinka && formLozinka.novaLozinka.length >= 13}
                                />
                                {touchedLozinka.novaLozinka && errorsLozinka.novaLozinka && (
                                    <div className="text-danger fw-semibold small mt-1">{errorsLozinka.novaLozinka}</div>
                                )}
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-50 d-block mx-auto fw-bold py-2 rounded-pill shadow-sm"
                                disabled={isSubmittingLozinka}
                            >
                                {isSubmittingLozinka ? 'Mijenjanje lozinke...' : 'Spremi novu lozinku'}
                            </Button>
                        </Form>
                    </Card>

                    <div>
                        <Button 
                            variant="danger" 
                            className="w-50 d-block mx-auto py-2 rounded-pill fw-semibold shadow-sm"
                            onClick={() => navigate(-1)}
                        >
                            Odustani (Natrag)
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}