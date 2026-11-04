import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import FishijadaService from "../../services/FishijadaService"
import { Button, Table, Form } from "react-bootstrap"
import { RouteNames } from "../../constants"
import LokacijaService from "../../services/lokacije/LokacijaService"
import PrijavaService from "../../services/prijave/PrijavaService"

export default function FishijadaDetalji() {
    const { sifra } = useParams()
    const navigate = useNavigate()
    const [fishijada, setFishijada] = useState(null)
    const [sveLokacije, setSveLokacije] = useState([])
    const [odabranaLokacija, setOdabranaLokacija] = useState('')
    const [svePrijave, setSvePrijave] = useState([])
    const [odabranePrijave, setOdabranePrijave] = useState({})

    useEffect(() => {
        ucitajDetalje()
        ucitajLokacije()
        ucitajPrijave()
    }, [sifra])

    async function ucitajDetalje() {
        await FishijadaService.getBySifra(sifra).then((odgovor) => {
            const f = odgovor.data
            if (!f.prijavePoLokacijama) {
                f.prijavePoLokacijama = {}
            }
            setFishijada(f)
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

    async function dodajLokaciju(e) {
        e.preventDefault()
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
        })
    }

   async function obrisiLokaciju(lokacijaId) {

        const dodijeljenePrijave = fishijada.prijavePoLokacijama?.[lokacijaId] || []

        if (dodijeljenePrijave.length > 0) {
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
        return <p className="mt-3">Učitavanje podataka...</p>
    }

    return (
        <div>
            <h3 className="my-3">Detalji fišijade: {fishijada.naziv}</h3>
            
            <Table hover striped bordered className="mt-3">
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
                        <td>{fishijada.aktivan ? 'Aktivna' : 'Neaktivna'}</td>
                    </tr>
                </tbody>
            </Table>

            <h3 className="mt-4">Lokacije koje sudjeluju</h3>
            <Form onSubmit={dodajLokaciju}>
                <Form.Group controlId="odabranaLokacija" className="mb-3">
                    <Form.Label>Odaberi lokaciju</Form.Label>
                    <Form.Select
                        value={odabranaLokacija}
                        onChange={(e) => setOdabranaLokacija(e.target.value)}>
                        <option value="">Izaberi lokaciju</option>
                        {sveLokacije.map((l) => {
                            const brojPrijava = svePrijave.filter(
                                p => p.lokacija === l.sifra || p.lokacijaSifra === l.sifra || p.lokacijaId === l.sifra
                            ).length
                            return (
                                <option key={l.sifra} value={l.sifra}>
                                    {l.mjesto} ({brojPrijava})
                                </option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                <Button type="submit" variant="success">
                    Dodaj lokaciju
                </Button>
            </Form>

            <h4 className="mt-4">Dodane lokacije</h4>
            <Table hover striped bordered className="mt-3">
                <thead>
                    <tr>
                        <th>Naziv lokacije i prijave</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {fishijada.lokacije && fishijada.lokacije.map((lokacijaId) => {
                        const lokacija = sveLokacije.find((l) => l.sifra === lokacijaId)
                        const dodijeljenePrijaveIds = fishijada.prijavePoLokacijama?.[lokacijaId] || []

                        return (
                            <tr key={lokacijaId}>
                                <td>
                                    <h5>{lokacija ? lokacija.mjesto : 'Nepoznata lokacija'}</h5>
                                    
                                    <div className="d-flex gap-2 my-2">
                                        <Form.Select
                                            size="sm"
                                            value={odabranePrijave[lokacijaId] || ''}
                                            onChange={(e) => setOdabranePrijave({
                                                ...odabranePrijave,
                                                [lokacijaId]: e.target.value
                                            })}
                                        >
                                            <option value="">Odaberi prijavu (ekipu)...</option>
                                            {svePrijave.map((p) => (
                                                <option key={p.sifra} value={p.sifra}>
                                                    {p.imePrezime} ({p.ekipa})
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Button 
                                            variant="success" 
                                            size="sm"
                                            onClick={() => dodajPrijavuNaLokaciju(lokacijaId)}
                                        >
                                            Dodaj prijavu
                                        </Button>
                                    </div>

                                    {dodijeljenePrijaveIds.length > 0 ? (
                                        <ul className="mb-0 mt-2">
                                            {dodijeljenePrijaveIds.map((pId) => {
                                                const prijavaObjekt = svePrijave.find(p => p.sifra === pId)
                                                return (
                                                    <li key={pId} className="py-1">
                                                        {prijavaObjekt ? `${prijavaObjekt.imePrezime} - ${prijavaObjekt.ekipa}` : 'Nepoznata prijava'}
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm" 
                                                            className="ms-3 py-0 px-1"
                                                            style={{ fontSize: '0.75rem' }}
                                                            onClick={() => ukloniPrijavuS_Lokacije(lokacijaId, pId)}
                                                        >
                                                            Ukloni prijavu
                                                        </Button>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ) : (
                                        <span className="text-muted small">Nema dodanih prijava na ovoj lokaciji.</span>
                                    )}
                                </td>
                                <td style={{ verticalAlign: 'middle' }}>
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        onClick={() => obrisiLokaciju(lokacijaId)}
                                    >
                                        Ukloni lokaciju
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <Button variant="secondary" onClick={() => navigate(RouteNames.FISHIJADE)} className="mt-3">
                Natrag na pregled
            </Button>
        </div>
    );
}