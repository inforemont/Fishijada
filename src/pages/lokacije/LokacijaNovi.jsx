import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RouteNames } from '../../constants'
import { Button, Col, Form, Row, Container, Alert } from 'react-bootstrap'
import LokacijaService from '../../services/lokacije/LokacijaService'
import useBreakpoint from '../../hooks/useBreakpoint'
import { ShemaLokacija } from '../../schemas/ShemaLokacija'

export default function LokacijaNovi() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const navigate = useNavigate()

    const [form, setForm] = useState({
        regija: '',
        mjesto: '',
        posta: '',
        zupanija: '',
        datumOdrzavanja: ''
    })

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [greskaServera, setGreskaServera] = useState('')

    const validateForm = (currentForm) => {
        const dataToValidate = {
            ...currentForm,
            posta: currentForm.posta !== '' ? Number(currentForm.posta) : NaN
        }

        const result = ShemaLokacija.safeParse(dataToValidate)
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

    async function obradiSubmit(e) {
        e.preventDefault()
        setTouched({
            regija: true,
            mjesto: true,
            posta: true,
            zupanija: true,
            datumOdrzavanja: true
        })

        const allErrors = validateForm(form)
        setErrors(allErrors)

        if (Object.keys(allErrors).length > 0) {
            return
        }

        try {
            await LokacijaService.dodaj({
                regija: form.regija.trim(),
                mjesto: form.mjesto.trim().toUpperCase(),
                posta: Number(form.posta),
                zupanija: form.zupanija.trim(),
                datumOdrzavanja: form.datumOdrzavanja,
                ekipe: []
            })
            navigate(RouteNames.LOKACIJE)
        } catch (err) {
            setGreskaServera(err.message || "Greška prilikom spremanja lokacije.")
        }
    }

    const imaGresaka = Object.keys(touched).some(key => errors[key]) || !!greskaServera

    return (
        <Container className="px-2 px-md-3 py-3">
            <h3 className="fw-bold mb-4">Dodavanje nove lokacije</h3>

            {greskaServera && (
                <Alert variant="danger" className="py-2 small fw-semibold mb-3">
                    ⚠️ {greskaServera}
                </Alert>
            )}

            <Form onSubmit={obradiSubmit} noValidate>
                <Form.Group controlId="regija" className="mb-3">
                    <Form.Label className="fw-semibold">Regija</Form.Label>
                    <Form.Control
                        type="text"
                        name="regija"
                        placeholder="npr. Baranja"
                        value={form.regija}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.regija && !!errors.regija}
                    />
                    {touched.regija && errors.regija && (
                        <div className="text-danger fw-semibold small mt-1">{errors.regija}</div>
                    )}
                </Form.Group>

                <Form.Group controlId="mjesto" className="mb-3">
                    <Form.Label className="fw-semibold">Mjesto</Form.Label>
                    <Form.Control
                        type="text"
                        name="mjesto"
                        placeholder="npr. Kneževi Vinogradi"
                        value={form.mjesto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.mjesto && !!errors.mjesto}
                    />
                    {touched.mjesto && errors.mjesto && (
                        <div className="text-danger fw-semibold small mt-1">{errors.mjesto}</div>
                    )}
                </Form.Group>

                <Form.Group controlId="posta" className="mb-3">
                    <Form.Label className="fw-semibold">Poštanski broj</Form.Label>
                    <Form.Control
                        type="number"
                        name="posta"
                        placeholder="npr. 31309"
                        value={form.posta}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.posta && !!errors.posta}
                    />
                    {touched.posta && errors.posta && (
                        <div className="text-danger fw-semibold small mt-1">{errors.posta}</div>
                    )}
                </Form.Group>

                <Form.Group controlId="zupanija" className="mb-3">
                    <Form.Label className="fw-semibold">Županija</Form.Label>
                    <Form.Control
                        type="text"
                        name="zupanija"
                        placeholder="npr. Osječko-baranjska"
                        value={form.zupanija}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.zupanija && !!errors.zupanija}
                    />
                    {touched.zupanija && errors.zupanija && (
                        <div className="text-danger fw-semibold small mt-1">{errors.zupanija}</div>
                    )}
                </Form.Group>

                <Form.Group controlId="datumOdrzavanja" className="mb-3">
                    <Form.Label className="fw-semibold">Datum održavanja</Form.Label>
                    <Form.Control
                        type="date"
                        name="datumOdrzavanja"
                        value={form.datumOdrzavanja}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.datumOdrzavanja && !!errors.datumOdrzavanja}
                    />
                    {touched.datumOdrzavanja && errors.datumOdrzavanja && (
                        <div className="text-danger fw-semibold small mt-1">{errors.datumOdrzavanja}</div>
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
                            Spremi lokaciju
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}