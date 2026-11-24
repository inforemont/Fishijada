import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import FishijadaService from "../../services/fishijade/FishijadaService"
import { Button, Table, Form, ListGroup, Row, Col, Container, Modal } from "react-bootstrap"
import { RouteNames } from "../../constants"
import LokacijaService from "../../services/lokacije/LokacijaService"
import PrijavaService from "../../services/prijave/PrijavaService"
import useBreakpoint from "../../hooks/useBreakpoint"

export default function FishijadaDetalji() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const { sifra } = useParams()
    const navigate = useNavigate()
    const [fishijada, setFishijada] = useState(null)
    const [sveLokacije, setSveLokacije] = useState([])
    const [odabranaLokacija, setOdabranaLokacija] = useState('')
    const [svePrijave, setSvePrijave] = useState([])
    const [odabranePrijave, setOdabranePrijave] = useState({})
    const [sveFishijade, setSveFishijade] = useState([])
    const [korisnik, setKorisnik] = useState(null)

    const [modalInfo, setModalInfo] = useState({
        prikazi: false,
        naslov: "",
        tekst: "",
        tip: "warning" 
    })

    const prikaziObavijest = (naslov, tekst, tip = "warning") => {
        setModalInfo({ prikazi: true, naslov, tekst, tip })
    }

    const zatvoriModal = () => {
        setModalInfo(prev => ({ ...prev, prikazi: false }))
    }

    const [lokacijaInputText, setLokacijaInputText] = useState('')
    const [prikaziLokacijeDropdown, setPrikaziLokacijeDropdown] = useState(false)
    const lokacijaDropdownRef = useRef(null)

    const [prijavaInputTexts, setPrijavaInputTexts] = useState({})
    const [prikaziPrijaveDropdowns, setPrikaziPrijaveDropdowns] = useState({})
    const prijavaDropdownRefs = useRef({})

    useEffect(() => {
        const spremljeniKorisnik = localStorage.getItem("prijavljeniKorisnik")
        if (spremljeniKorisnik) {
            setKorisnik(JSON.parse(spremljeniKorisnik))
        }

        ucitajDetalje()
        ucitajLokacije()
        ucitajPrijave()
        ucitajSveFishijade()
    }, [sifra])

    useEffect(() => {
        function handleClickOutside(event) {
            if (lokacijaDropdownRef.current && !lokacijaDropdownRef.current.contains(event.target)) {
                setPrikaziLokacijeDropdown(false)
            }
            Object.keys(prijavaDropdownRefs.current).forEach((lokacijaId) => {
                const ref = prijavaDropdownRefs.current[lokacijaId]
                if (ref && !ref.contains(event.target)) {
                    setPrikaziPrijaveDropdowns(prev => ({ ...prev, [lokacijaId]: false }))
                }
            })
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const isAdmin = korisnik?.uloga === "Admin"

    async function ucitajDetalje() {
        await FishijadaService.getBySifra(sifra).then((odgovor) => {
            const f = odgovor.data
            if (f) {
                if (!f.lokacije) {
                    f.lokacije = []
                }
                if (!f.prijavePoLokacijama) {
                    f.prijavePoLokacijama = {}
                }
                setFishijada(f)
            }
        })
    }

    async function ucitajLokacije() {
        await LokacijaService.get().then((odgovor) => {
            setSveLokacije(odgovor.data || [])
        })
    }

    async function ucitajPrijave() {
        await PrijavaService.get().then((odgovor) => {
            setSvePrijave(odgovor.data || [])
        })
    }

    async function ucitajSveFishijade() {
        FishijadaService.get().then((res) => setSveFishijade(res.data || []))
    }

    const jeOdrzana = fishijada?.datumPokretanja
        ? new Date(fishijada.datumPokretanja) < new Date()
        : false

    async function dodajLokaciju(e) {
        e.preventDefault()

        if (!isAdmin) {
            prikaziObavijest("Zabranjeno", "Samo administrator može dodavati lokacije.", "danger")
            return
        }

        if (jeOdrzana) {
            prikaziObavijest(
                "Fišijada je zaključana", 
                "Ova fišijada je već održana! Nije moguće dodavati nove lokacije na zaključane podatke.", 
                "danger"
            )
            return
        }

        if (!odabranaLokacija) {
            prikaziObavijest("Greška u unosu", "Molimo odaberite lokaciju s popisa.", "warning")
            return
        }

        // Zadržavamo ID kao string (podržava i alfanumeričke Firebase ID-jeve i numeričke)
        const lokacijaId = String(odabranaLokacija)

        if (fishijada.lokacije.includes(lokacijaId)) {
            prikaziObavijest("Dupla lokacija", "Ova lokacija je već dodana na fišijadu.", "warning")
            return
        }

        const prijaveZaOvuLokaciju = svePrijave
            .filter(p => String(p.lokacijaId || p.lokacija) === lokacijaId)
            .map(p => String(p.sifra))

        const azuriraneLokacije = [...fishijada.lokacije, lokacijaId]
        const izmjenjenaFishijada = { 
            ...fishijada, 
            lokacije: azuriraneLokacije,
            prijavePoLokacijama: {
                ...fishijada.prijavePoLokacijama,
                [lokacijaId]: prijaveZaOvuLokaciju
            }
        }

        await FishijadaService.promjeni(sifra, izmjenjenaFishijada).then(() => {
            setFishijada(izmjenjenaFishijada)
            setOdabranaLokacija('')
            setLokacijaInputText('')
        })
    }

    async function obrisiLokaciju(lokacijaId) {
        if (!isAdmin) {
            prikaziObavijest("Zabranjeno", "Samo administrator može brisati lokacije.", "danger")
            return
        }

        const dodijeljenePrijaveIds = 
            fishijada.prijavePoLokacijama?.[lokacijaId] || 
            fishijada.prijavePoLokacijama?.[String(lokacijaId)] || []

        if (dodijeljenePrijaveIds.length > 0) {
            prikaziObavijest(
                "Nije moguće ukloniti lokaciju", 
                "Na ovoj lokaciji još uvijek postoje pridružene prijave (ekipe). Prvo uklonite sve prijave s ove lokacije.", 
                "danger"
            )
            return
        }

        if (!window.confirm("Jeste li sigurni da želite ukloniti ovu lokaciju?")) {
            return
        }

        const azuriraneLokacije = fishijada.lokacije.filter((id) => String(id) !== String(lokacijaId))
        const novePrijavePoLokacijama = { ...fishijada.prijavePoLokacijama }
        delete novePrijavePoLokacijama[lokacijaId]

        const izmjenjenaFishijada = {
            ...fishijada,
            lokacije: azuriraneLokacije,
            prijavePoLokacijama: novePrijavePoLokacijama
        }

        await FishijadaService.promjeni(sifra, izmjenjenaFishijada).then(() => {
            setFishijada(izmjenjenaFishijada)
        })
    }

    async function dodajPrijavuNaLokaciju(lokacijaId) {
        if (!isAdmin) {
            prikaziObavijest("Zabranjeno", "Samo administrator može dodavati prijave na lokaciju.", "danger")
            return
        }

        const prijavaId = odabranePrijave[lokacijaId]

        if (jeOdrzana) {
            prikaziObavijest(
                "Fišijada je zaključana", 
                "Ova fišijada je već održana! Nije moguće dodavati nove prijave.", 
                "danger"
            )
            return
        }

        if (!prijavaId) {
            prikaziObavijest("Greška", "Molimo odaberite prijavu/ekipu iz padajućeg izbornika.", "warning")
            return
        }

        const trenutnePrijaveNaLokaciji = fishijada.prijavePoLokacijama?.[lokacijaId] || []

        if (trenutnePrijaveNaLokaciji.includes(String(prijavaId))) {
            prikaziObavijest("Dupla prijava", "Ova prijava je već dodana na ovu lokaciju.", "warning")
            return
        }

        const azuriranePrijaveNaLokaciji = [...trenutnePrijaveNaLokaciji, String(prijavaId)]

        const izmjenjenaFishijada = {
            ...fishijada,
            prijavePoLokacijama: {
                ...fishijada.prijavePoLokacijama,
                [lokacijaId]: azuriranePrijaveNaLokaciji
            }
        }

        await FishijadaService.promjeni(sifra, izmjenjenaFishijada).then(() => {
            setFishijada(izmjenjenaFishijada)
            setOdabranePrijave({ ...odabranePrijave, [lokacijaId]: '' })
            setPrijavaInputTexts({ ...prijavaInputTexts, [lokacijaId]: '' })
        })
    }

    async function ukloniPrijavuS_Lokacije(lokacijaId, prijavaId) {
        if (!isAdmin) {
            prikaziObavijest("Zabranjeno", "Samo administrator može uklanjati prijave s lokacije.", "danger")
            return
        }

        const trenutnePrijaveNaLokaciji = fishijada.prijavePoLokacijama?.[lokacijaId] || []
        const azuriranePrijaveNaLokaciji = trenutnePrijaveNaLokaciji.filter(id => String(id) !== String(prijavaId))

        const izmjenjenaFishijada = {
            ...fishijada,
            prijavePoLokacijama: {
                ...fishijada.prijavePoLokacijama,
                [lokacijaId]: azuriranePrijaveNaLokaciji
            }
        }

        await FishijadaService.promjeni(sifra, izmjenjenaFishijada).then(() => {
            setFishijada(izmjenjenaFishijada)
        })
    }

    if (!fishijada) {
        return <Container className="mt-3"><p>Učitavanje podataka...</p></Container>
    }

    const filtriraneLokacije = sveLokacije.filter(l => 
        l.mjesto && l.mjesto.toLowerCase().includes(lokacijaInputText.toLowerCase())
    )

    return (
        <Container className="px-2 px-md-3">
            <h3 className="my-3 fs-4 fs-md-3">Detalji fišijade: {fishijada.naziv}</h3>

            <div className="table-responsive">
                <Table hover striped bordered className="mt-3 align-middle">
                    <tbody>
                        <tr>
                            <td><strong>Naziv:</strong></td>
                            <td>{fishijada.naziv}</td>
                        </tr>
                        <tr>
                            <td><strong>Mjesto održavanja:</strong></td>
                            <td>{fishijada.mjestoOdrzavanja}</td>
                        </tr>
                        <tr>
                            <td><strong>Kotizacija:</strong></td>
                            <td>{fishijada.cijena} €</td>
                        </tr>
                        <tr>
                            <td><strong>Datum pokretanja:</strong></td>
                            <td>{fishijada.datumPokretanja ? new Date(fishijada.datumPokretanja.replace('Z', '')).toLocaleDateString() : ''}</td>
                        </tr>
                        <tr>
                            <td><strong>Status aktivnosti:</strong></td>
                            <td>{!jeOdrzana ? 'U tijeku' : 'Održana'}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <h3 className="mt-4 fs-4 fs-md-3">Lokacije koje sudjeluju</h3>

            <Form.Group className="mb-4">
                <Form.Label>Odaberi drugu fišijadu:</Form.Label>
                <Form.Select
                    value={sifra}
                    onChange={(e) => navigate(RouteNames.FISHIJADE_DETALJI.replace(':sifra', e.target.value))}
                >
                    {sveFishijade.map((f) => {
                        const godina = f.datumPokretanja ? new Date(f.datumPokretanja.replace('Z', '')).getFullYear() : '';
                        return (
                            <option key={f.sifra} value={f.sifra}>
                                {f.naziv} ({godina}.)
                            </option>
                        )
                    })}
                </Form.Select>
            </Form.Group>

            {isAdmin && (
                <Form onSubmit={dodajLokaciju}>
                    <Row className={`align-items-end mb-3 ${jeMobitel ? 'flex-column gap-2' : ''}`}>
                        <Col xs={12} md={4} className="position-relative" ref={lokacijaDropdownRef}>
                            <Form.Group controlId="odabranaLokacija">
                                <Form.Label>Odaberi lokaciju</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Upiši naziv lokacije..."
                                    value={lokacijaInputText}
                                    onFocus={() => setPrikaziLokacijeDropdown(true)}
                                    onChange={(e) => {
                                        setLokacijaInputText(e.target.value)
                                        setPrikaziLokacijeDropdown(true)
                                        setOdabranaLokacija('')
                                    }}
                                />

                                {prikaziLokacijeDropdown && (
                                    <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                        {filtriraneLokacije.length > 0 ? (
                                            filtriraneLokacije.map((l) => {
                                                const lId = String(l.sifra || l.id)
                                                const brojPrijava = svePrijave.filter(p => String(p.lokacijaId || p.lokacija) === lId).length
                                                return (
                                                    <ListGroup.Item
                                                        key={lId}
                                                        action
                                                        onClick={() => {
                                                            setOdabranaLokacija(lId)
                                                            setLokacijaInputText(`${l.mjesto} (${brojPrijava})`)
                                                            setPrikaziLokacijeDropdown(false)
                                                        }}
                                                    >
                                                        {l.mjesto} ({brojPrijava})
                                                    </ListGroup.Item>
                                                )
                                            })
                                        ) : (
                                            <ListGroup.Item disabled>Nema pronađenih lokacija</ListGroup.Item>
                                        )}
                                    </ListGroup>
                                )}
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                            <Button type="submit" variant={jeOdrzana ? "secondary" : "success"} className="w-100">
                                {jeOdrzana ? "Zaključano (Održano)" : "Dodaj"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )}

            <h4 className="mt-4">Dodane lokacije</h4>
            <div className="table-responsive">
                <Table hover striped bordered className="mt-3 align-middle">
                    <thead>
                        <tr>
                            <th>Naziv lokacije i prijave</th>
                            {isAdmin && <th>Akcija</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {fishijada.lokacije && fishijada.lokacije.length > 0 ? (
                            fishijada.lokacije.map((lokacijaId) => {
                                // Pronađi lokaciju uspoređujući ID-jeve kao stringove
                                const lokacija = sveLokacije.find((l) => 
                                    String(l.sifra || l.id) === String(lokacijaId)
                                )
                                
                                const dodijeljenePrijaveIds = fishijada.prijavePoLokacijama?.[lokacijaId] || 
                                    fishijada.prijavePoLokacijama?.[String(lokacijaId)] || []
                                
                                const trenutniInputPrijave = prijavaInputTexts[lokacijaId] || ''
                                const prikazDropdownPrijave = prikaziPrijaveDropdowns[lokacijaId] || false
                                const filtriranePrijave = svePrijave.filter(p => 
                                    `${p.imePrezime} ${p.ekipa}`.toLowerCase().includes(trenutniInputPrijave.toLowerCase())
                                )

                                return (
                                    <tr key={lokacijaId}>
                                        <td style={{ verticalAlign: 'top' }}>
                                            <h5 className="mb-3">
                                                {lokacija ? lokacija.mjesto : `Lokacija ID: ${lokacijaId}`}
                                            </h5>

                                            {dodijeljenePrijaveIds.length > 0 ? (
                                                <ul className="mb-0">
                                                    {dodijeljenePrijaveIds.map((pId) => {
                                                        const prijavaObjekt = svePrijave.find(p => 
                                                            String(p.sifra || p.id) === String(pId)
                                                        )
                                                        return (
                                                            <li key={pId} className="py-1 d-flex justify-content-between align-items-center">
                                                                <span>
                                                                    {prijavaObjekt ? `${prijavaObjekt.imePrezime} (${prijavaObjekt.ekipa})` : `Prijava ID: ${pId}`}
                                                                </span>

                                                                {isAdmin && !jeOdrzana && (
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        className="py-0 px-1 ms-2"
                                                                        style={{ fontSize: '0.75rem' }}
                                                                        onClick={() => ukloniPrijavuS_Lokacije(lokacijaId, pId)}
                                                                    >
                                                                        Ukloni
                                                                    </Button>
                                                                )}
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            ) : (
                                                <span className="text-muted small">Nema dodanih prijava na ovoj lokaciji.</span>
                                            )}
                                        </td>
                                        
                                        {isAdmin && (
                                            <td className="align-middle">
                                                {!jeOdrzana && (
                                                    <div className="mb-2">
                                                        <div className={jeMobitel ? "d-flex flex-column gap-2" : "d-flex gap-2 justify-content-center align-items-center flex-wrap"}>
                                                            <div 
                                                                className="position-relative" 
                                                                style={{ width: jeMobitel ? '100%' : '200px' }}
                                                                ref={el => prijavaDropdownRefs.current[lokacijaId] = el}
                                                            >
                                                                <Form.Control
                                                                    size="sm"
                                                                    type="text"
                                                                    placeholder="Pretraži prijavu..."
                                                                    value={trenutniInputPrijave}
                                                                    onFocus={() => setPrikaziPrijaveDropdowns({ ...prikaziPrijaveDropdowns, [lokacijaId]: true })}
                                                                    onChange={(e) => {
                                                                        setPrijavaInputTexts({ ...prijavaInputTexts, [lokacijaId]: e.target.value })
                                                                        setPrikaziPrijaveDropdowns({ ...prikaziPrijaveDropdowns, [lokacijaId]: true })
                                                                        setOdabranePrijave({ ...odabranePrijave, [lokacijaId]: '' })
                                                                    }}
                                                                />

                                                                {prikazDropdownPrijave && (
                                                                    <ListGroup className="position-absolute w-100 shadow text-start" style={{ zIndex: 1000, maxHeight: '180px', overflowY: 'auto' }}>
                                                                        {filtriranePrijave.length > 0 ? (
                                                                            filtriranePrijave.map((p) => {
                                                                                const pId = String(p.sifra || p.id)
                                                                                return (
                                                                                    <ListGroup.Item
                                                                                        key={pId}
                                                                                        action
                                                                                        size="sm"
                                                                                        onClick={() => {
                                                                                            setOdabranePrijave({ ...odabranePrijave, [lokacijaId]: pId })
                                                                                            setPrijavaInputTexts({ ...prijavaInputTexts, [lokacijaId]: `${p.imePrezime} (${p.ekipa})` })
                                                                                            setPrikaziPrijaveDropdowns({ ...prikaziPrijaveDropdowns, [lokacijaId]: false })
                                                                                        }}
                                                                                    >
                                                                                        {p.imePrezime} ({p.ekipa})
                                                                                    </ListGroup.Item>
                                                                                )
                                                                            })
                                                                        ) : (
                                                                            <ListGroup.Item disabled size="sm">Nema pronađenih prijava</ListGroup.Item>
                                                                        )}
                                                                    </ListGroup>
                                                                )}
                                                            </div>

                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                style={{ width: jeMobitel ? '100%' : '80px' }}
                                                                onClick={() => dodajPrijavuNaLokaciju(lokacijaId)}
                                                            >
                                                                Dodaj
                                                            </Button>

                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                style={{ width: jeMobitel ? '100%' : '110px' }}
                                                                onClick={() => obrisiLokaciju(lokacijaId)}
                                                            >
                                                                Ukloni
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? "2" : "1"} className="text-center text-muted">
                                    Nema dodanih lokacija za ovu fišijadu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <Button variant="secondary" onClick={() => navigate(RouteNames.FISHIJADE)} className="mt-3 mb-4">
                Natrag na pregled
            </Button>

            <Modal show={modalInfo.prikazi} onHide={zatvoriModal} centered>
                <Modal.Header closeButton className={`bg-${modalInfo.tip} text-white`}>
                    <Modal.Title className="fw-bold fs-5">
                        {modalInfo.tip === 'danger' ? '⚠️ Obavijest sustava' : 'ℹ️ Informacija'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4 text-center">
                    <h5 className="fw-bold mb-3">{modalInfo.naslov}</h5>
                    <p className="text-secondary mb-0">{modalInfo.tekst}</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center border-0 pb-3">
                    <Button 
                        variant={modalInfo.tip === 'danger' ? 'danger' : 'success'} 
                        className="rounded-pill px-4 fw-bold shadow-sm"
                        onClick={zatvoriModal}
                    >
                        U redu
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}