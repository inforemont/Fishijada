import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row } from "react-bootstrap"
import PrijavaService from "../../services/prijave/PrijavaService"
import { useEffect, useState } from "react"
import LokacijaService from "../../services/lokacije/LokacijaService"

export default function PrijavaPromjena() {

    const navigate = useNavigate()
    const params = useParams()

    const [lokacije, setLokacije] = useState([])
    const [odabranaLokacija, setOdabranaLokacija] = useState('')
    const [prijava, setPrijava] = useState({})
    const [korisnik, setKorisnik] = useState(null)

    async function ucitajPrijave() {
        try {
            const spremljeniKorisnik = localStorage.getItem("prijavljeniKorisnik")
            if (spremljeniKorisnik) {
                setKorisnik(JSON.parse(spremljeniKorisnik))
            }

            const odgovorLokacije = await LokacijaService.get()
            setLokacije(odgovorLokacije.data || [])

            const odgovorPrijava = await PrijavaService.getBySifra(params.sifra)
            const pData = odgovorPrijava.data || {}
            setPrijava(pData)

            if (pData.lokacija !== undefined && pData.lokacija !== null) {
                setOdabranaLokacija(String(pData.lokacija))
            }
        } catch (error) {
            console.error("Ne mogu učitati podatke", error)
        }
    }

    useEffect(() => {
        ucitajPrijave()
    }, [params.sifra])

    const isAdmin = korisnik?.uloga === "Admin"

    async function promjeni(prijavaSlanje) {
        try {
            await PrijavaService.promjeni(params.sifra, prijavaSlanje)
            navigate(RouteNames.PRIJAVE)
        } catch (error) {
            console.error("Greška kod promjene prijave:", error)
            alert("Došlo je do greške prilikom spremanja promjena.")
        }
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        if (!odabranaLokacija) {
            alert("Molimo odaberite lokaciju.")
            return
        }

        // Ako korisnik nije admin, polje za stol je disabled pa ga čitamo direktno iz state-a (prijava.stol)
        const noviStol = isAdmin 
            ? (parseInt(podaci.get('stol')) || 0) 
            : (prijava.stol || 0)

        promjeni({
            imePrezime: podaci.get('imePrezime'),
            ekipa: podaci.get('ekipa'),
            stol: noviStol,
            email: podaci.get('email'),
            kotizacijaPlacena: podaci.get('kotizacijaPlacena') === 'on',
            lokacija: isNaN(odabranaLokacija) ? odabranaLokacija : parseInt(odabranaLokacija)
        })
    }

    return (
        <>
            <h3 className="my-3">
                Promijeni prijavu
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="imePrezime" className="mb-3">
                    <Form.Label>IME I PREZIME</Form.Label>
                    <Form.Control type="text" name="imePrezime" required
                        defaultValue={prijava.imePrezime || ''} />
                </Form.Group>

                <Form.Group controlId="ekipa" className="mb-3">
                    <Form.Label>EKIPA</Form.Label>
                    <Form.Control type="text" name="ekipa" required
                        defaultValue={prijava.ekipa || ''} />
                </Form.Group>

                <Form.Group controlId="stol" className="mb-3">
                    <Form.Label>STOL {isAdmin ? "" : "(Zaključano)"}</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="stol" 
                        required
                        disabled={!isAdmin} // Zaključano ako nije admin
                        defaultValue={prijava.stol || ''} 
                    />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" name="email" required
                        defaultValue={prijava.email || ''} />
                </Form.Group>

                <Form.Group controlId="kotizacijaPlacena" className="mt-3 mb-3">
                    <Form.Check
                        label="Kotizacija uplaćena"
                        name="kotizacijaPlacena"
                        defaultChecked={!!prijava.kotizacijaPlacena}
                    />
                </Form.Group>

                <Form.Group controlId="lokacija" className="mt-3">
                    <Form.Label>LOKACIJA</Form.Label>
                    <Form.Select
                        name="lokacija"
                        required
                        value={odabranaLokacija}
                        onChange={(e) => setOdabranaLokacija(e.target.value)}
                    >
                        <option value="">Odaberi lokaciju...</option>
                        {lokacije && lokacije.map((l) => (
                            <option key={l.sifra} value={l.sifra}>
                                {l.mjesto}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.PRIJAVE}
                            className="btn btn-danger w-100">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success" className="w-100">
                            Promijeni
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}