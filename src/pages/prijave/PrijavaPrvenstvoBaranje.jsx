import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap"
import PrijavaService from "../../services/prijave/PrijavaService"
import LokacijaService from "../../services/lokacije/LokacijaService"
import { useState, useEffect } from "react"
import { jsPDF } from 'jspdf'
import { robotoBase64 } from '../../fonts/robotoFont'

export default function PrijavaPrvenstvoBaranje() {

    const navigate = useNavigate()
    const [lokacije, setLokacije] = useState([])
    const [svePrijave, setSvePrijave] = useState([])
    const [stol, setStol] = useState('')
    const [poslanaPrijava, setPoslanaPrijava] = useState(null)

    useEffect(() => {
        LokacijaService.get().then((o) => {
            setLokacije(o.data)
        })
        PrijavaService.get().then((o) => {
            setSvePrijave(o.data)
        })
    }, [])

    async function dodaj(prijava) {
        await PrijavaService.dodaj(prijava).then(() => {
            setPoslanaPrijava(prijava)
        })
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

    function obradiSubmit(e) {
        e.preventDefault() 
        const podaci = new FormData(e.target)

        if(!podaci.get('imePrezime') || podaci.get('imePrezime').trim().length === 0){
            alert("Ime i prezime je obavezno i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('imePrezime').trim().length < 6 || podaci.get('imePrezime').trim().length > 30){
            alert("Ime i Prezime mora sadržavati između 6 i 30 znakova")
            return 
        }

        if(!podaci.get('ekipa') || podaci.get('ekipa').trim().length === 0){
            alert("Ekipa je obavezna i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('ekipa').trim().length < 3 || podaci.get('ekipa').trim().length > 30){
            alert("Ekipa mora sadržavati između 3 i 30 znakova")
            return 
        }

        if (isNaN(podaci.get('stol')) || podaci.get('stol') < 1 || podaci.get('stol') > 500){
            alert("Unesite ispravan broj stola")
            return
        }
        if(!podaci.get('stol') || podaci.get('stol') === ""){
            alert("Broj stola mora biti unesen")
            return 
        }

        if(!podaci.get('email') || podaci.get('email').trim().length === 0){
            alert("Email je obavezan i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('email').trim().length < 6 || podaci.get('email').trim().length > 30){
            alert("Email mora sadržavati između 6 i 30 znakova")
            return 
        }

        dodaj({
            imePrezime: podaci.get('imePrezime'),
            ekipa: podaci.get('ekipa'),
            stol: parseFloat(podaci.get('stol')),
            email: podaci.get('email'),
            kotizacijaPlacena: podaci.get('kotizacijaPlacena') === 'on',
            prvenstvoHrvatske: true,
            lokacija: 111,
            fishijada: 111,
        })
    }

    // Pomoćna funkcija za postavljanje fonta
    function postaviRobotoFont(doc) {
        doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64)
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
        doc.setFont('Roboto', 'normal')
    }

    function generirajPDF() {
        const doc = new jsPDF()
        postaviRobotoFont(doc)

        const odabraniNazivLokacije = 'Beli Manastir (Prvenstvo Baranje)'

        doc.setFont("Roboto", "bold")
        doc.setFontSize(14)
        doc.text(`SLUŽBENA PRIJAVA - ${odabraniNazivLokacije.toUpperCase()}`, 20, 20)

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
        doc.text(`Kotizacija uplaćena: ${poslanaPrijava?.kotizacijaPlacena ? 'DA' : 'NE'}`, 20, 88)
        doc.text(`Sudjelovanje na Prvenstvu Hrvatske/Baranja: DA`, 20, 96)

        doc.line(20, 122, 190, 122)
        doc.setFont("Roboto", "bold")
        doc.text("Potpis voditelja ekipe: ___________________________", 20, 134)

        return doc
    }

    function preuzmiPDF() {
        const doc = generirajPDF()
        doc.save(`Prijava_Prvenstvo_${poslanaPrijava?.ekipa?.replace(/\s+/g, '_') || 'ekipa'}.pdf`)
    }

    function ispisiPDF() {
        const doc = generirajPDF()
        doc.autoPrint()
        const blob = doc.output('blob')
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
    }

    return (
        <>
            <h3 className="my-3">
                Prijava za Prvenstvo Baranje u Belom Manastiru
            </h3>

        {!poslanaPrijava ? (
            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="imePrezime">
                    <Form.Label>IME I PREZIME</Form.Label>
                    <Form.Control type="text" name="imePrezime" required />
                </Form.Group>

                <Form.Group controlId="ekipa">
                    <Form.Label>EKIPA</Form.Label>
                    <Form.Control type="text" name="ekipa" />
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

                <Form.Group controlId="email">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" name="email" />
                </Form.Group>

                <Form.Group controlId="kotizacijaPlacena" className="mt-3">
                    <Form.Check label="Kotizacija uplaćena" name="kotizacijaPlacena" />
                </Form.Group>

                <Form.Group controlId="lokacija" className="mt-3">
                    <FormLabel>LOKACIJA</FormLabel>
                    <Form.Select 
                        name="lokacija"
                        required
                        defaultValue={111}
                        disabled
                    >
                        <option value={111}>
                            Beli Manastir (Baranja)
                        </option>
                    </Form.Select>
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.PRIJAVE} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>
        ) : (
            <div className="text-center p-4 border rounded bg-light my-4">
                <h4 className="text-success mb-3">Prijava za Prvenstvo Baranje je uspješno spremljena!</h4>
                <p>Možete preuzeti PDF obrazac ili ga direktno ispisati:</p>
                
                <div className="d-flex justify-content-center gap-3 mt-4">
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
        </>
    )
}