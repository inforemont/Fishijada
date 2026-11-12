import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import FishijadaService from "../../services/FishijadaService"
import { Button, Table, Form, ListGroup, Row, Col, Container } from "react-bootstrap"
import { RouteNames } from "../../constants"
import LokacijaService from "../../services/lokacije/LokacijaService"
import PrijavaService from "../../services/prijave/PrijavaService"
import FormatDatuma from "../../components/FormatDatuma"
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

    const [lokacijaInputText, setLokacijaInputText] = useState('')
    const [prikaziLokacijeDropdown, setPrikaziLokacijeDropdown] = useState(false)
    const lokacijaDropdownRef = useRef(null)

    const [prijavaInputTexts, setPrijavaInputTexts] = useState({})
    const [prikaziPrijaveDropdowns, setPrikaziPrijaveDropdowns] = useState({})
    const prijavaDropdownRefs = useRef({})

    useEffect(() => {
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
            setSveLokacije(odgovor.data)
        })
    }

    async function ucitajPrijave() {
        await PrijavaService.get().then((odgovor) => {
            setSvePrijave(odgovor.data)
        })
    }

    async function ucitajSveFishijade() {
        FishijadaService.get().then((res) => setSveFishijade(res.data))
    }

    async function dodajLokaciju(e) {
        e.preventDefault()

        if (jeOdrzana) {
            alert("Ova fišijada je već održana! Nije moguće dodavati nove lokacije na zaključane podatke.")
            return
        }

        if (!odabranaLokacija) {
            alert("Lokacija je obavezna")
            return
        }
        const lokacijaId = parseInt(odabranaLokacija)

        if (fishijada.lokacije.includes(lokacijaId)) {
            alert("Lokacija je vec dodana")
            return
        }

        const azuriraneLokacije = [...fishijada.lokacije, lokacijaId]
        const izmjenjenaFishijada = { ...fishijada, lokacije: azuriraneLokacije }

        await FishijadaService.promjeni(sifra, izmjenjenaFishijada).then(() => {
            setFishijada(izmjenjenaFishijada)
            setOdabranaLokacija('')
            setLokacijaInputText('')
        })
    }

    async function obrisiLokaciju(lokacijaId) {
        const dodijeljenePrijaveIds = 
            fishijada.prijavePoLokacijama?.[lokacijaId] || 
            fishijada.prijavePoLokacijama?.[String(lokacijaId)] || 
            fishijada.prijavePoLokacijama?.[Number(lokacijaId)] || 
            []

        if (dodijeljenePrijaveIds.length > 0) {
            alert("Nije moguće ukloniti lokaciju jer na njoj još uvijek postoje pridružene prijave (ekipe). Prvo uklonite sve prijave s ove lokacije.")
            return
        }

        if (!window.confirm("Jeste li sigurni da želite ukloniti ovu lokaciju?")) {
            return
        }

        const azuriraneLokacije = fishijada.lokacije.filter((id) => id !== lokacijaId)
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
        const prijavaId = odabranePrijave[lokacijaId]

        if (jeOdrzana) {
            alert("Ova fišijada je već održana! Nije moguće dodavati nove prijave.")
            return
        }

        if (!prijavaId) {
            alert("Molimo odaberite prijavu/ekipu")
            return
        }

        const trenutnePrijaveNaLokaciji = fishijada.prijavePoLokacijama?.[lokacijaId] || []

        if (trenutnePrijaveNaLokaciji.includes(parseInt(prijavaId))) {
            alert("Ova prijava je već dodana na ovu lokaciju.")
            return
        }

        const azuriranePrijaveNaLokaciji = [...trenutnePrijaveNaLokaciji, parseInt(prijavaId)]

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
        const trenutnePrijaveNaLokaciji = fishijada.prijavePoLokacijama?.[lokacijaId] || []
        const azuriranePrijaveNaLokaciji = trenutnePrijaveNaLokaciji.filter(id => id !== prijavaId)

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

    const jeOdrzana = fishijada?.datumPokretanja
        ? new Date(fishijada.datumPokretanja) < new Date()
        : false

    const filtriraneLokacije = sveLokacije.filter(l => 
        l.mjesto.toLowerCase().includes(lokacijaInputText.toLowerCase())
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
                            <td>{fishijada.datumPokretanja}</td>
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
                    onChange={(e) => navigate(`/fishijade/detalji/${e.target.value}`)}
                >
                    {sveFishijade.map((f) => {
                        const godina = new Date(f.datumPokretanja).getFullYear();
                        return (
                            <option key={f.sifra} value={f.sifra}>
                                {f.naziv} ({godina}.)
                            </option>
                        )
                    })}
                </Form.Select>
            </Form.Group>

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
                                            const brojPrijava = (fishijada?.prijavePoLokacijama?.[l.sifra] || []).length
                                            return (
                                                <ListGroup.Item
                                                    key={l.sifra}
                                                    action
                                                    onClick={() => {
                                                        setOdabranaLokacija(l.sifra)
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

            <h4 className="mt-4">Dodane lokacije</h4>
            <div className="table-responsive">
                <Table hover striped bordered className="mt-3 align-middle">
                    <thead>
                        <tr>
                            <th>Naziv lokacije i prijave</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fishijada.lokacije && fishijada.lokacije.length > 0 ? (
                            fishijada.lokacije.map((lokacijaId) => {
                                const lokacija = sveLokacije.find((l) => Number(l.sifra) === Number(lokacijaId))
                                const dodijeljenePrijaveIds = fishijada.prijavePoLokacijama?.[lokacijaId] || []
                                
                                const trenutniInputPrijave = prijavaInputTexts[lokacijaId] || ''
                                const prikazDropdownPrijave = prikaziPrijaveDropdowns[lokacijaId] || false
                                const filtriranePrijave = svePrijave.filter(p => 
                                    `${p.imePrezime} ${p.ekipa}`.toLowerCase().includes(trenutniInputPrijave.toLowerCase())
                                )

                                return (
                                    <tr key={lokacijaId}>
                                        <td style={{ verticalAlign: 'top' }}>
                                            <h5 className="mb-3">{lokacija ? lokacija.mjesto : `Lokacija ID: ${lokacijaId}`}</h5>

                                            {dodijeljenePrijaveIds.length > 0 ? (
                                                <ul className="mb-0">
                                                    {dodijeljenePrijaveIds.map((pId) => {
                                                        const prijavaObjekt = svePrijave.find(p => Number(p.sifra) === Number(pId))
                                                        return (
                                                            <li key={pId} className="py-1 d-flex justify-content-between align-items-center">
                                                                <span>
                                                                    {prijavaObjekt ? `${prijavaObjekt.imePrezime} (${prijavaObjekt.ekipa})` : 'Nepoznata prijava'}
                                                                </span>

                                                                {!jeOdrzana && (
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
                                                                        filtriranePrijave.map((p) => (
                                                                            <ListGroup.Item
                                                                                key={p.sifra}
                                                                                action
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    setOdabranePrijave({ ...odabranePrijave, [lokacijaId]: p.sifra })
                                                                                    setPrijavaInputTexts({ ...prijavaInputTexts, [lokacijaId]: `${p.imePrezime} (${p.ekipa})` })
                                                                                    setPrikaziPrijaveDropdowns({ ...prikaziPrijaveDropdowns, [lokacijaId]: false })
                                                                                }}
                                                                            >
                                                                                {p.imePrezime} ({p.ekipa})
                                                                            </ListGroup.Item>
                                                                        ))
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
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center text-muted">
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
        </Container>
    )
}