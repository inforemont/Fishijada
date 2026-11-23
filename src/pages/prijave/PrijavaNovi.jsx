import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, FormLabel, Row, Alert, Container, Modal } from "react-bootstrap"
import PrijavaService from "../../services/prijave/PrijavaService"
import LokacijaService from "../../services/lokacije/LokacijaService"
import { jsPDF } from 'jspdf'
import { robotoBase64 } from '../../fonts/robotoFont'
import useBreakpoint from "../../hooks/useBreakpoint"
import { ShemaPrijava } from "../../schemas/ShemaPrijava" 

import pandaHappy from "../../assets/pandahappy.gif"
import pandaMad from "../../assets/pandamad.gif"

export default function PrijavaNovi() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const navigate = useNavigate()

    const [lokacije, setLokacije] = useState([])
    const [svePrijave, setSvePrijave] = useState([])
    const [poslanaPrijava, setPoslanaPrijava] = useState(null)
    const [prijavljeniKorisnik, setPrijavljeniKorisnik] = useState(null)

    const [odabraneSlikeBase64, setOdabraneSlikeBase64] = useState([])
    const [greskaSlike, setGreskaSlike] = useState('')
    const [statusUploada, setStatusUploada] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)


    const [duplaPrijavaModal, setDuplaPrijavaModal] = useState(false)

    const [form, setForm] = useState({
        imePrezime: '',
        ekipa: '',
        stol: '',
        email: '',
        kotizacijaPlacena: false,
        prvenstvoHrvatske: false,
        lokacija: ''
    })

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    useEffect(() => {
        const korisnikStorage = localStorage.getItem("prijavljeniKorisnik")
        if (korisnikStorage) {
            const k = JSON.parse(korisnikStorage)
            setPrijavljeniKorisnik(k)
            setForm(prev => ({
                ...prev,
                email: k.email || k.korisnickoIme || prev.email,
                imePrezime: k.ime || prev.imePrezime
            }))
        }

        LokacijaService.get().then((o) => {
            setLokacije(o.data)
        })

        PrijavaService.get().then((o) => {
            setSvePrijave(o.data)
        }).catch(() => {
            const lokalnePrijave = JSON.parse(localStorage.getItem('prijave')) || []
            setSvePrijave(lokalnePrijave)
        })
    }, [])

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    async function potvrdiUploadSlika(e) {
        const files = Array.from(e.target.files)
        setGreskaSlike('')
        setStatusUploada('')

        if (files.length > 36) {
            setGreskaSlike('Možete odabrati maksimalno 36 fotografija.')
            return
        }

        const previseVelika = files.some(file => file.size > 5 * 1024 * 1024)
        if (previseVelika) {
            setGreskaSlike('Jedna ili više fotografija prelazi maksimalnu veličinu od 5 MB.')
            return
        }

        try {
            const base64Promises = files.map(file => toBase64(file))
            const base64Results = await Promise.all(base64Promises)

            setOdabraneSlikeBase64(base64Results)
            setStatusUploada(`Uspješno učitano ${base64Results.length} fotografija!`)
        } catch (err) {
            setGreskaSlike('Greška prilikom učitavanja slika.')
        }
    }

    function dodijeliSlucajniStol(zauzetiStolovi) {
        const sviStolovi = Array.from({ length: 500 }, (_, i) => i + 1)
        const slobodniStolovi = sviStolovi.filter(s => !zauzetiStolovi.includes(s))
        if (slobodniStolovi.length === 0) {
            alert("Svi stolovi od 1 do 500 su popunjeni!")
            return ''
        }
        const nasumicniIndeks = Math.floor(Math.random() * slobodniStolovi.length)
        return slobodniStolovi[nasumicniIndeks]
    }

    const PostaviAutomatskiStol = () => {
        const zauzetiStolovi = svePrijave.map(p => Number(p.stol)).filter(Boolean)
        const dodijeljeniBroj = dodijeliSlucajniStol(zauzetiStolovi)

        const updatedForm = { ...form, stol: dodijeljeniBroj }
        setForm(updatedForm)
        setTouched(prev => ({ ...prev, stol: true }))

        const newErrors = validateForm(updatedForm)
        setErrors(newErrors)
    }

    const validateForm = (currentForm) => {
        const dataToValidate = {
            ...currentForm,
            stol: currentForm.stol !== '' ? Number(currentForm.stol) : NaN,
            lokacija: currentForm.lokacija !== '' ? Number(currentForm.lokacija) : NaN
        }

        const result = ShemaPrijava.safeParse(dataToValidate)
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
        const { name, value, type, checked } = e.target
        let val = type === 'checkbox' ? checked : value

        if (['imePrezime', 'ekipa'].includes(name)) {
            val = val.replace(/[0-9]/g, '')
        }

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

    async function obradiSubmit(e) {
        e.preventDefault()
        if (isSubmitting) return

        setTouched({
            imePrezime: true,
            ekipa: true,
            stol: true,
            email: true,
            lokacija: true
        })

        const allErrors = validateForm(form)
        setErrors(allErrors)

        if (Object.keys(allErrors).length > 0) {
            return
        }

        if (prijavljeniKorisnik) {
            const vecPostojiNaLokaciji = svePrijave.some(p => 
                String(p.korisnikSifra) === String(prijavljeniKorisnik.sifra) && 
                Number(p.lokacija) === Number(form.lokacija)
            )

            if (vecPostojiNaLokaciji) {
                setDuplaPrijavaModal(true)
                return
            }
        }

        setIsSubmitting(true)

        const novaPrijava = {
            sifra: Date.now(),
            korisnikSifra: prijavljeniKorisnik ? prijavljeniKorisnik.sifra : null,
            imePrezime: form.imePrezime.trim(),
            ekipa: form.ekipa.trim(),
            stol: parseFloat(form.stol),
            email: form.email.trim(),
            kotizacijaPlacena: form.kotizacijaPlacena,
            prvenstvoHrvatske: form.prvenstvoHrvatske,
            lokacija: parseInt(form.lokacija),
            slike: odabraneSlikeBase64
        }

        let uspjesnoNaServeru = false;

        try {
            await PrijavaService.dodaj(novaPrijava)
            uspjesnoNaServeru = true;
        } catch (err) {
            console.log("Server nije dostupan, spremamo u localStorage.")
        }
        if (!uspjesnoNaServeru) {
            const trenutnePrijave = JSON.parse(localStorage.getItem('prijave')) || []
            const vecPostoji = trenutnePrijave.some(p => p.sifra === novaPrijava.sifra)

            if (!vecPostoji) {
                const azuriranePrijave = [...trenutnePrijave, novaPrijava]
                localStorage.setItem('prijave', JSON.stringify(azuriranePrijave))
            }
        }

        setPoslanaPrijava(novaPrijava)
        setIsSubmitting(false)
    }

    const odabraniObjekt = lokacije.find(l => l.sifra == form.lokacija)
    const jeBeliManastir = odabraniObjekt?.mjesto === 'Beli Manastir'

    function postaviRobotoFont(doc) {
        doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64)
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
        doc.setFont('Roboto', 'normal')
    }

    function generirajPDF() {
        const doc = new jsPDF()
        postaviRobotoFont(doc)

        const odabraniNazivLokacije = lokacije.find(l => l.sifra == form.lokacija)?.mjesto || 'Nepoznata lokacija'

        doc.setFont("Roboto", "bold")
        doc.setFontSize(14)
        doc.text(`SLUŽBENA PRIJAVA - FIŠIJADA ${odabraniNazivLokacije.toUpperCase()}`, 20, 20)

        doc.setFontSize(10)
        doc.setFont("Roboto", "normal")
        doc.text(`Datum prijave: ${new Date().toLocaleDateString('hr-HR')}`, 20, 32)

        doc.setLineWidth(0.3)
        doc.line(20, 38, 190, 38)

        doc.setFont("Roboto", "bold")
        doc.setFontSize(12)
        doc.text("Podaci o sudioniku:", 20, 48)

        doc.setFont("Roboto", "normal")
        doc.setFontSize(11)
        doc.text(`Ime i prezime: ${poslanaPrijava?.imePrezime || ''}`, 20, 56)
        doc.text(`Naziv ekipe: ${poslanaPrijava?.ekipa || ''}`, 20, 64)
        doc.text(`Dodijeljeni stol: ${poslanaPrijava?.stol || ''}`, 20, 72)
        doc.text(`E-mail adresa: ${poslanaPrijava?.email || ''}`, 20, 80)
        doc.text(`Odabrana lokacija: ${odabraniNazivLokacije}`, 20, 88)
        doc.text(`Kotizacija uplaćena: ${poslanaPrijava?.kotizacijaPlacena ? 'DA' : 'NE'}`, 20, 96)

        if (poslanaPrijava?.prvenstvoHrvatske) {
            doc.text(`Sudjelovanje na Prvenstvu Hrvatske: DA`, 20, 104)
        }

        doc.line(20, 122, 190, 122)
        doc.setFont("Roboto", "bold")
        doc.text("Potpis voditelja ekipe: ___________________________", 20, 134)

        return doc
    }

    function preuzmiPDF() {
        const doc = generirajPDF()
        doc.save(`Prijava_${poslanaPrijava?.ekipa?.replace(/\s+/g, '_') || 'ekipa'}.pdf`)
    }

    function ispisiPDF() {
        const doc = generirajPDF()
        doc.autoPrint()
        window.open(doc.output('bloburl'), '_blank')
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
                    /* Responzivni okvir za pandu koji se postepeno smanjuje */
                    .panda-prozor {
                        width: 100%;
                        max-width: 190px;
                        transition: max-width 0.3s ease;
                    }
                    @media (max-width: 1000px) {
                        .panda-prozor {
                            max-width: clamp(120px, 40vw, 190px);
                        }
                    }
                `}
            </style>

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h3 className="fw-bold text-dark m-0 fs-2 skacuci-naslov">
                        Dodavanje nove prijave
                    </h3>
                </div>

                <div className="text-center bg-white p-2 rounded-4 shadow-sm border panda-prozor">
                    {imaGresaka ? (
                        <div>
                            <img
                                src={pandaMad}
                                alt="Panda razbija sve"
                                style={{ width: "100%", height: "auto", maxHeight: "130px", objectFit: "cover", borderRadius: "8px" }}
                                className="shadow-sm border border-danger"
                            />
                            <div className="text-danger fw-bold mt-1" style={{ fontSize: "11px" }}>Panda razbija sve! 🐼💥</div>
                        </div>
                    ) : (
                        <div>
                            <img
                                src={pandaHappy}
                                alt="Sretna panda"
                                style={{ width: "100%", height: "auto", maxHeight: "130px", objectFit: "cover", borderRadius: "8px" }}
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

            {!poslanaPrijava ? (
                <Form onSubmit={obradiSubmit} noValidate>
                    <Form.Group controlId="imePrezime" className="mb-3">
                        <Form.Label className="fw-semibold">IME I PREZIME</Form.Label>
                        <Form.Control
                            type="text"
                            name="imePrezime"
                            placeholder="npr. Tomislav Jakopec"
                            value={form.imePrezime}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.imePrezime && !!errors.imePrezime}
                            isValid={touched.imePrezime && !errors.imePrezime && form.imePrezime.trim().length > 0}
                        />
                        {touched.imePrezime && errors.imePrezime && (
                            <div className="text-danger fw-semibold small mt-1">
                                {errors.imePrezime}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="ekipa" className="mb-3">
                        <Form.Label className="fw-semibold">EKIPA</Form.Label>
                        <Form.Control
                            type="text"
                            name="ekipa"
                            placeholder="npr. Zlatna Ribica"
                            value={form.ekipa}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.ekipa && !!errors.ekipa}
                            isValid={touched.ekipa && !errors.ekipa && form.ekipa.trim().length > 0}
                        />
                        {touched.ekipa && errors.ekipa && (
                            <div className="text-danger fw-semibold small mt-1">
                                {errors.ekipa}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="stol" className="mb-3">
                        <Form.Label className="fw-semibold">STOL</Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Control
                                type="number"
                                name="stol"
                                value={form.stol}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.stol && !!errors.stol}
                                isValid={touched.stol && !errors.stol && form.stol !== ''}
                                readOnly
                            />
                            <Button type="button" variant="outline-primary" onClick={PostaviAutomatskiStol}>
                                🎲 Dodijeli stol
                            </Button>
                        </div>
                        {touched.stol && errors.stol && (
                            <div className="text-danger fw-semibold small mt-1">
                                {errors.stol}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label className="fw-semibold">E-mail</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="npr. tjakopec@gmail.com"
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

                    <Form.Group controlId="slike" className="mb-3">
                        <Form.Label className="fw-semibold">GALERIJA FOTOGRAFIJA (Max. 36 slika, do 5MB po slici)</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            accept="image/jpeg, image/jpg, image/png, image/webp"
                            onChange={potvrdiUploadSlika}
                        />
                        <Form.Text className="text-muted">
                            Odabrano slika za upload: {odabraneSlikeBase64.length} / 36
                        </Form.Text>
                        {greskaSlike && <Alert variant="danger" className="mt-2 py-1">{greskaSlike}</Alert>}
                        {statusUploada && <Alert variant="success" className="mt-2 py-1">{statusUploada}</Alert>}
                    </Form.Group>

                    <Form.Group controlId="kotizacijaPlacena" className="mt-3">
                        <Form.Check
                            label="Kotizacija uplaćena"
                            name="kotizacijaPlacena"
                            checked={form.kotizacijaPlacena}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {jeBeliManastir && (
                        <Form.Group controlId="prvenstvoHrvatske" className="mt-3">
                            <Form.Check
                                label="Prvenstvo Hrvatske"
                                name="prvenstvoHrvatske"
                                checked={form.prvenstvoHrvatske}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    )}

                    <Form.Group controlId="lokacija" className="mt-3 mb-3">
                        <FormLabel className="fw-semibold">LOKACIJA</FormLabel>
                        <Form.Select
                            name="lokacija"
                            value={form.lokacija}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.lokacija && !!errors.lokacija}
                            isValid={touched.lokacija && !errors.lokacija && form.lokacija !== ''}
                        >
                            <option value="">Odaberi lokaciju...</option>
                            {lokacije.filter((l) => l.sifra !== 111).map((l) => (
                                <option key={l.sifra} value={l.sifra}>
                                    {l.mjesto}
                                </option>
                            ))}
                        </Form.Select>
                        {touched.lokacija && errors.lokacija && (
                            <div className="text-danger fw-semibold small mt-1">
                                {errors.lokacija}
                            </div>
                        )}
                    </Form.Group>

                    <Row className={`mt-4 ${jeMobitel ? 'flex-column gap-2' : ''}`}>
                        <Col xs={12} md={6}>
                            <Link to={RouteNames.PRIJAVE} className="btn btn-danger w-100 py-2 fw-semibold">
                                Odustani
                            </Link>
                        </Col>
                        <Col xs={12} md={6} className={jeMobitel ? '' : 'text-end'}>
                            <Button type="submit" variant="success" className="w-100 py-2 fw-semibold" disabled={isSubmitting}>
                                {isSubmitting ? 'Spremanje...' : 'Dodaj'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            ) : (
                <div className="text-center p-4 border rounded bg-light my-4">
                    <h4 className="text-success mb-3">Prijava je uspješno spremljena!</h4>
                    <p>Možete preuzeti PDF obrazac ili ga direktno ispisati:</p>

                    <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                        <Button variant="primary" onClick={preuzmiPDF}>
                            Preuzmi PDF prijavu
                        </Button>
                        <Button variant="secondary" onClick={ispisiPDF}>
                            Ipiši PDF
                        </Button>
                        <Button variant="success" onClick={() => navigate(RouteNames.PRIJAVE)}>
                            Natrag na pregled prijava
                        </Button>
                    </div>
                </div>
            )}
            <Modal show={duplaPrijavaModal} onHide={() => setDuplaPrijavaModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="fw-bold fs-5">⚠️ Obavijest o prijavi</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <p className="fs-5 mb-0">Već ste prijavljeni na ovu fišijadu!</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center border-0 pb-3">
                    <Button variant="danger" className="rounded-pill px-4" onClick={() => setDuplaPrijavaModal(false)}>
                        Odustani
                    </Button>
                    <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => setDuplaPrijavaModal(false)}>
                        U redu
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}