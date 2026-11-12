import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, FormLabel, Row, Alert, Container } from "react-bootstrap"
import PrijavaService from "../../services/prijave/PrijavaService"
import { useState, useEffect } from "react"
import LokacijaService from "../../services/lokacije/LokacijaService"
import { jsPDF } from 'jspdf'
import { robotoBase64 } from '../../fonts/robotoFont'
import useBreakpoint from "../../hooks/useBreakpoint"

export default function PrijavaNovi() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const navigate = useNavigate()

    const [lokacije, setLokacije] = useState([])
    const [odabranaLokacija, setOdabranaLokacija] = useState('')
    const [svePrijave, setSvePrijave] = useState([])
    const [stol, setStol] = useState('')
    const [poslanaPrijava, setPoslanaPrijava] = useState(null)

    const [odabraneSlikeBase64, setOdabraneSlikeBase64] = useState([])
    const [greskaSlike, setGreskaSlike] = useState('')
    const [statusUploada, setStatusUploada] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        LokacijaService.get().then((o) => {
            setLokacije(o.data)
        })
        const lokalnePrijave = JSON.parse(localStorage.getItem('prijave')) || []
        setSvePrijave(lokalnePrijave)
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
        setStol(dodijeljeniBroj)
    }

    async function obradiSubmit(e) {
        e.preventDefault()
        if (isSubmitting) return
        setIsSubmitting(true)

        const podaci = new FormData(e.target)

        if (!podaci.get('imePrezime') || podaci.get('imePrezime').trim().length === 0) {
            alert("Ime i prezime je obavezno i ne smije sadržavati samo razmake")
            setIsSubmitting(false)
            return
        }
        if (!podaci.get('ekipa') || podaci.get('ekipa').trim().length === 0) {
            alert("Ekipa je obavezna i ne smije sadržavati samo razmake")
            setIsSubmitting(false)
            return
        }
        if (!podaci.get('stol')) {
            alert("Broj stola mora biti unesen")
            setIsSubmitting(false)
            return
        }
        if (!podaci.get('email')) {
            alert("Email je obavezna stavka")
            setIsSubmitting(false)
            return
        }

        const novaPrijava = {
            sifra: Date.now(),
            imePrezime: podaci.get('imePrezime'),
            ekipa: podaci.get('ekipa'),
            stol: parseFloat(podaci.get('stol')),
            email: podaci.get('email'),
            kotizacijaPlacena: podaci.get('kotizacijaPlacena') === 'on',
            prvenstvoHrvatske: podaci.get('prvenstvoHrvatske') === 'on',
            lokacija: parseInt(podaci.get('lokacija')),
            slike: odabraneSlikeBase64
        }

        let uspjesnoNaServeru = false;

        // 1. Pokušaj spremanja na server
        try {
            await PrijavaService.dodaj(novaPrijava)
            uspjesnoNaServeru = true;
        } catch (err) {
            console.log("Server nije dostupan, spremamo u localStorage.")
        }

        // 2. Ako server NIJE uspio, spremamo isključivo jednom u localStorage
        if (!uspjesnoNaServeru) {
            const trenutnePrijave = JSON.parse(localStorage.getItem('prijave')) || []
            
            // Provjera da li već postoji zapis s istom šifrom da spriječimo duplikat
            const vecPostoji = trenutnePrijave.some(p => p.sifra === novaPrijava.sifra)
            
            if (!vecPostoji) {
                const azuriranePrijave = [...trenutnePrijave, novaPrijava]
                localStorage.setItem('prijave', JSON.stringify(azuriranePrijave))
            }
        }

        setPoslanaPrijava(novaPrijava)
    }

    const odabraniObjekt = lokacije.find(l => l.sifra == odabranaLokacija)
    const jeBeliManastir = odabraniObjekt?.mjesto === 'Beli Manastir'

    function postaviRobotoFont(doc) {
        doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64)
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
        doc.setFont('Roboto', 'normal')
    }

    function generirajPDF() {
        const doc = new jsPDF()
        postaviRobotoFont(doc)

        const odabraniNazivLokacije = lokacije.find(l => l.sifra === odabranaLokacija)?.mjesto || 'Nepoznata lokacija'

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

    return (
        <Container className="px-2 px-md-3">
            <h3 className="my-3 fs-4 fs-md-3">
                Dodavanje nove prijave
            </h3>
            {!poslanaPrijava ? (
                <Form onSubmit={obradiSubmit}>
                    <Form.Group controlId="imePrezime" className="mb-3">
                        <Form.Label>IME I PREZIME</Form.Label>
                        <Form.Control type="text" name="imePrezime" required />
                    </Form.Group>

                    <Form.Group controlId="ekipa" className="mb-3">
                        <Form.Label>EKIPA</Form.Label>
                        <Form.Control type="text" name="ekipa" required />
                    </Form.Group>

                    <Form.Group controlId="stol" className="mb-3">
                        <Form.Label>STOL</Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Control
                                type="number"
                                name="stol"
                                value={stol}
                                readOnly
                            />
                            <Button type="button" variant="outline-primary" onClick={PostaviAutomatskiStol}>
                                🎲 Dodijeli stol
                            </Button>
                        </div>
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control type="email" name="email" required />
                    </Form.Group>

                    <Form.Group controlId="slike" className="mb-3">
                        <Form.Label>GALERIJA FOTOGRAFIJA (Max. 36 slika, do 5MB po slici)</Form.Label>
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
                        <Form.Check label="Kotizacija uplaćena" name="kotizacijaPlacena" />
                    </Form.Group>

                    {jeBeliManastir && (
                        <Form.Group controlId="prvenstvoHrvatske" className="mt-3">
                            <Form.Check label="Prvenstvo Hrvatske" name="prvenstvoHrvatske" />
                        </Form.Group>
                    )}

                    <Form.Group controlId="lokacija" className="mt-3 mb-3">
                        <FormLabel>LOKACIJA</FormLabel>
                        <Form.Select
                            name="lokacija"
                            required
                            value={odabranaLokacija}
                            onChange={(e) => setOdabranaLokacija(e.target.value)}
                        >
                            <option value="">Odaberi lokaciju...</option>
                            {lokacije.filter((l) => l.sifra !== 111).map((l) => (
                                <option key={l.sifra} value={l.sifra}>
                                    {l.mjesto}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Row className={`mt-4 ${jeMobitel ? 'flex-column gap-2' : ''}`}>
                        <Col xs={12} md={6}>
                            <Link to={RouteNames.PRIJAVE} className="btn btn-danger w-100">
                                Odustani
                            </Link>
                        </Col>
                        <Col xs={12} md={6} className={jeMobitel ? '' : 'text-end'}>
                            <Button type="submit" variant="success" className="w-100" disabled={isSubmitting}>
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
                            Ispiši PDF
                        </Button>
                        <Button variant="success" onClick={() => navigate(RouteNames.PRIJAVE)}>
                            Natrag na pregled prijava
                        </Button>
                    </div>
                </div>
            )}
        </Container>
    )
}