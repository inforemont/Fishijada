import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row, Container, Alert } from "react-bootstrap"
import LokacijaService from "../../services/lokacije/LokacijaService"
import useBreakpoint from "../../hooks/useBreakpoint"

import pandaHappy from "../../assets/pandahappy.gif"
import pandaMad from "../../assets/pandamad.gif"

export default function LokacijaNovi() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const navigate = useNavigate()

    const [form, setForm] = useState({
        regija: '',
        mjesto: '',
        zupanija: '',
        posta: '',
        datumOdrzavanja: ''
    })

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const validateForm = (currentForm) => {
        const newErrors = {}

        const regijaTrim = currentForm.regija.trim()
        if (regijaTrim.length > 0 && (regijaTrim.length < 3 || regijaTrim.length > 30)) {
            newErrors.regija = "Regija mora imati između 3 i 30 znakova."
        }

        const mjestoTrim = currentForm.mjesto.trim()
        if (mjestoTrim.length > 0 && (mjestoTrim.length < 2 || mjestoTrim.length > 40)) {
            newErrors.mjesto = "Mjesto mora imati između 2 i 40 znakova."
        }

        const zupanijaTrim = currentForm.zupanija.trim()
        if (zupanijaTrim.length > 0 && (zupanijaTrim.length < 3 || zupanijaTrim.length > 40)) {
            newErrors.zupanija = "Županija mora imati između 3 i 40 znakova."
        }

        if (currentForm.posta !== '') {
            const postaNum = Number(currentForm.posta)
            if (isNaN(postaNum) || postaNum < 10000 || postaNum > 99999) {
                newErrors.posta = "Poštanski broj mora imati 5 znamenki."
            }
        }

        if (currentForm.datumOdrzavanja !== '' && isNaN(Date.parse(currentForm.datumOdrzavanja))) {
            newErrors.datumOdrzavanja = "Nevaljan format datuma."
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

    async function dodaj(lokacija) {
        await LokacijaService.dodaj(lokacija).then(() => {
            navigate(RouteNames.LOKACIJE)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()

        setTouched({
            regija: true,
            mjesto: true,
            zupanija: true,
            posta: true,
            datumOdrzavanja: true
        })

        const allErrors = validateForm(form)

        if (!form.regija.trim()) allErrors.regija = "Regija je obavezna."
        if (!form.mjesto.trim()) allErrors.mjesto = "Mjesto je obavezno."
        if (!form.zupanija.trim()) allErrors.zupanija = "Županija je obavezna."
        if (!form.posta) allErrors.posta = "Poštanski broj je obavezan."
        if (!form.datumOdrzavanja) allErrors.datumOdrzavanja = "Datum održavanja je obavezan."

        setErrors(allErrors)

        if (Object.keys(allErrors).length > 0) {
            return
        }

        dodaj({
            regija: form.regija.trim(),
            mjesto: form.mjesto.trim(),
            zupanija: form.zupanija.trim(),
            posta: parseFloat(form.posta),
            datumOdrzavanja: form.datumOdrzavanja,
            ekipe: []
        })
    }

    const otvoriKalendar = (e) => {
        try {
            if (e.target.showPicker) {
                e.target.showPicker()
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
                        Dodavanje nove lokacije
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
                    ⚠️ Pažnja! Podaci nisu u redu, panda je upravo bacila sve sa stola! Ispravite greške ispod.
                </Alert>
            )}

            <Form onSubmit={obradiSubmit} noValidate>

                <Form.Group controlId="regija" className="mb-3">
                    <Form.Label className="fw-semibold">REGIJA</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="regija" 
                        value={form.regija}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.regija && !!errors.regija}
                        isValid={touched.regija && !errors.regija && form.regija.trim().length > 0}
                    />
                    {touched.regija && errors.regija && (
                        <div className="text-danger fw-semibold small mt-1">
                            {errors.regija}
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="mjesto" className="mb-3">
                    <Form.Label className="fw-semibold">MJESTO</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="mjesto" 
                        value={form.mjesto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.mjesto && !!errors.mjesto}
                        isValid={touched.mjesto && !errors.mjesto && form.mjesto.trim().length > 0}
                    />
                    {touched.mjesto && errors.mjesto && (
                        <div className="text-danger fw-semibold small mt-1">
                            {errors.mjesto}
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="zupanija" className="mb-3">
                    <Form.Label className="fw-semibold">ŽUPANIJA</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="zupanija" 
                        value={form.zupanija}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.zupanija && !!errors.zupanija}
                        isValid={touched.zupanija && !errors.zupanija && form.zupanija.trim().length > 0}
                    />
                    {touched.zupanija && errors.zupanija && (
                        <div className="text-danger fw-semibold small mt-1">
                            {errors.zupanija}
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="posta" className="mb-3">
                    <Form.Label className="fw-semibold">POŠTANSKI BROJ</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="posta" 
                        value={form.posta}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.posta && !!errors.posta}
                        isValid={touched.posta && !errors.posta && form.posta !== ''}
                    />
                    {touched.posta && errors.posta && (
                        <div className="text-danger fw-semibold small mt-1">
                            {errors.posta}
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="datumOdrzavanja" className="mb-3">
                    <Form.Label className="fw-semibold">DATUM ODRŽAVANJA</Form.Label>
                    <Form.Control 
                        type="date" 
                        name="datumOdrzavanja" 
                        value={form.datumOdrzavanja}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onClick={otvoriKalendar}
                        isInvalid={touched.datumOdrzavanja && !!errors.datumOdrzavanja}
                        isValid={touched.datumOdrzavanja && !errors.datumOdrzavanja && form.datumOdrzavanja !== ''}
                    />
                    {touched.datumOdrzavanja && errors.datumOdrzavanja && (
                        <div className="text-danger fw-semibold small mt-1">
                            {errors.datumOdrzavanja}
                        </div>
                    )}
                </Form.Group>

                <Row className={`mt-4 ${jeMobitel ? 'flex-column gap-2' : ''}`}>
                    <Col xs={12} md={6}>
                        <Link to={RouteNames.LOKACIJE} className="btn btn-danger w-100 py-2 fw-semibold">
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