import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row, Container, Alert } from "react-bootstrap"
import FishijadaService from "../../services/FishijadaService"
import useBreakpoint from "../../hooks/useBreakpoint"

import pandaHappy from "../../assets/pandahappy.gif"
import pandaMad from "../../assets/pandamad.gif"

export default function FishijadaNovi() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const navigate = useNavigate()
    
    const [form, setForm] = useState({
        naziv: '',
        mjestoOdrzavanja: '',
        kotizacija: '',
        datumPokretanja: '',
        aktivan: false
    })

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const validateForm = (currentForm) => {
        const newErrors = {}

        const nazivTrim = currentForm.naziv.trim()
        if (nazivTrim.length > 0 && (nazivTrim.length < 3 || nazivTrim.length > 40)) {
            newErrors.naziv = "Naziv mora imati između 3 i 40 znakova."
        }

        const adresaTrim = currentForm.mjestoOdrzavanja.trim()
        if (adresaTrim.length > 0 && (adresaTrim.length < 5 || adresaTrim.length > 50)) {
            newErrors.mjestoOdrzavanja = "Adresa mora imati između 5 i 50 znakova."
        }

        if (currentForm.kotizacija !== '') {
            const kotizacijaNum = Number(currentForm.kotizacija)
            const decimalPart = currentForm.kotizacija.toString().split('.')[1]

            if (isNaN(kotizacijaNum)) {
                newErrors.kotizacija = "Kotizacija mora biti valjani broj."
            } else if (kotizacijaNum < 30 || kotizacijaNum > 200) {
                newErrors.kotizacija = "Kotizacija mora biti između 30 i 200 €."
            } else if (decimalPart && decimalPart.length > 2) {
                newErrors.kotizacija = "Kotizacija može imati najviše 2 decimale."
            }
        }

        if (currentForm.datumPokretanja !== '' && isNaN(Date.parse(currentForm.datumPokretanja))) {
            newErrors.datumPokretanja = "Nevaljan format datuma."
        }

        return newErrors
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const val = type === 'checkbox' ? checked : value
        
        const updatedForm = { ...form, [name]: val }
        setForm(updatedForm)

        setTouched(prev => ({ ...prev, [name]: true }))

        const liveErrors = validateForm(updatedForm)
        setErrors(liveErrors)
    }

    const handleBlur = (e) => {
        const { name } = e.target
        setTouched(prev => ({ ...prev, [name]: true }))
    }

    async function dodaj(fishijada){
        await FishijadaService.dodaj(fishijada).then(()=>{
            navigate(RouteNames.FISHIJADE)
        })
    }

    function obradiSubmit(e){
        e.preventDefault() 
        setTouched({
            naziv: true,
            mjestoOdrzavanja: true,
            kotizacija: true,
            datumPokretanja: true
        })

        const allErrors = validateForm(form)
        
        if (!form.naziv.trim()) allErrors.naziv = "Naziv je obavezan."
        if (!form.mjestoOdrzavanja.trim()) allErrors.mjestoOdrzavanja = "Adresa je obavezna."
        if (form.kotizacija === '') allErrors.kotizacija = "Kotizacija je obavezna."
        if (!form.datumPokretanja) allErrors.datumPokretanja = "Datum je obavezan."

        setErrors(allErrors)

        if (Object.keys(allErrors).length > 0) {
            return
        }

        dodaj({
            naziv: form.naziv.trim(),
            mjestoOdrzavanja: form.mjestoOdrzavanja.trim(),
            cijena: Number(form.kotizacija),
            datumPokretanja: new Date(form.datumPokretanja).toISOString(),
            aktivan: form.aktivan,
            lokacije: []
        })
    }

    const otvoriKalendar = (e) => {
        try {
            if (e.target.showPicker) {
                e.target.showPicker();
            }
        } catch (error) {
        }
    }

    const imaGresaka = Object.keys(touched).some(key => errors[key])

    return (
        <Container className="px-2 px-md-3 py-3">
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

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark m-0 fs-2 skacuci-naslov">
                        Dodavanje nove fišijade
                    </h3>
                </div>

                <div className="text-center bg-white p-2 rounded-4 shadow-sm border">
                    {imaGresaka ? (
                        <div>
                            <img 
                                src={pandaMad} 
                                alt="Panda razbija sve" 
                                style={{ width: "190px", height: "140px", objectFit: "cover", borderRadius: "8px" }}
                                className="shadow-sm border border-danger"
                            />
                            <div className="text-danger fw-bold mt-1" style={{ fontSize: "11px" }}>Panda razbija sve! 🐼💥</div>
                        </div>
                    ) : (
                        <div>
                            <img 
                                src={pandaHappy} 
                                alt="Sretna panda" 
                                style={{ width: "190px", height: "140px", objectFit: "cover", borderRadius: "8px" }}
                                className="shadow-sm border border-success"
                            />
                            <div className="text-success fw-bold mt-1" style={{ fontSize: "11px" }}>Sve je super! 🐼😊</div>
                        </div>
                    )}
                </div>
            </div>

            {imaGresaka && (
                <Alert variant="danger" className="py-2 text-center fw-bold shadow-sm mb-4">
                    ⚠️ Pažnja! Podaci nisu u redu, panda nije dobre volje!
                </Alert>
            )}

            <Form onSubmit={obradiSubmit} noValidate>

                <Form.Group controlId="naziv" className="mb-3">
                    <Form.Label className="fw-semibold">NAZIV</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="naziv" 
                        value={form.naziv}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.naziv && !!errors.naziv}
                        isValid={touched.naziv && !errors.naziv && form.naziv.trim().length > 0}
                    />
                    {touched.naziv && errors.naziv && (
                        <div className="text-danger fw-semibold small mt-1">
                            {errors.naziv}
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="mjestoOdrzavanja" className="mb-3">
                    <Form.Label className="fw-semibold">ADRESA:</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="mjestoOdrzavanja" 
                        value={form.mjestoOdrzavanja}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.mjestoOdrzavanja && !!errors.mjestoOdrzavanja}
                        isValid={touched.mjestoOdrzavanja && !errors.mjestoOdrzavanja && form.mjestoOdrzavanja.trim().length > 0}
                    />
                    {touched.mjestoOdrzavanja && errors.mjestoOdrzavanja && (
                        <div className="text-danger fw-semibold small mt-1">
                            {errors.mjestoOdrzavanja}
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="kotizacija" className="mb-3">
                    <Form.Label className="fw-semibold">KOTIZACIJA (€)</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="kotizacija" 
                        step="any" 
                        value={form.kotizacija}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.kotizacija && !!errors.kotizacija}
                        isValid={touched.kotizacija && !errors.kotizacija && form.kotizacija !== ''}
                    />
                    {touched.kotizacija && errors.kotizacija && (
                        <div className="text-danger fw-semibold small mt-1">
                            {errors.kotizacija}
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="datumPokretanja" className="mb-3">
                    <Form.Label className="fw-semibold">DATUM ODRŽAVANJA</Form.Label>
                    <Form.Control 
                        type="date" 
                        name="datumPokretanja" 
                        value={form.datumPokretanja}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onClick={otvoriKalendar}
                        isInvalid={touched.datumPokretanja && !!errors.datumPokretanja}
                        isValid={touched.datumPokretanja && !errors.datumPokretanja && form.datumPokretanja !== ''}
                    />
                    {touched.datumPokretanja && errors.datumPokretanja && (
                        <div className="text-danger fw-semibold small mt-1">
                            {errors.datumPokretanja}
                        </div>
                    )}
                </Form.Group>

                <Row className={`mt-4 ${jeMobitel ? 'flex-column gap-2' : ''}`}>
                    <Col xs={12} md={6}>
                        <Link to={RouteNames.FISHIJADE} className="btn btn-danger w-100 py-2 fw-semibold">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={12} md={6} className={jeMobitel ? '' : 'text-end'}>
                        <Button type="submit" variant="success" className="w-100 py-2 fw-semibold">
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}