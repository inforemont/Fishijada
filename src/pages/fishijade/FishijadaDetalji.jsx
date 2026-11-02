import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import FishijadaService from "../../services/FishijadaService"
import { Button, Table,Form } from "react-bootstrap"
import { RouteNames } from "../../constants"
import LokacijaService from "../../services/lokacije/LokacijaService"
import PrijavaService from "../../services/prijave/PrijavaService"

export default function FishijadaDetalji() {
    const { sifra } = useParams()
    const navigate = useNavigate()
    const [fishijada, setFishijada] = useState(null)
    const [sveLokacije, setSveLokacije]=useState([])
    const[odabranaLokacija, setOdabranaLokacija]=useState('')
    const [svePrijave,setSvePrijave]=useState([])



    useEffect(() => {
        ucitajDetalje()
        ucitajLokacije()
        ucitajPrijave()
        }, [sifra])

    async function ucitajDetalje() {
        await FishijadaService.getBySifra(sifra).then((odgovor) => {
            setFishijada(odgovor.data)
        })
    }

     async function ucitajLokacije() {
        await LokacijaService.get().then((odgovor) => {
            setSveLokacije(odgovor.data)
        })
    }

    async function dodajLokaciju(e) {
        e.preventDefault()
        if(!odabranaLokacija){
            alert("Lokacija je obavezna")
            return
        }
        const lokacijaId=parseInt(odabranaLokacija)

        if(fishijada.lokacije.includes(lokacijaId)){
            alert("Lokacija je vec dodana")
            return
        }
    

    const azuriraneLokacije=[...fishijada.lokacije,lokacijaId]

    const izmjenjenaFishijada={...fishijada,lokacije:azuriraneLokacije}

    await FishijadaService.promjeni(sifra,izmjenjenaFishijada).then(()=>{
        setFishijada(izmjenjenaFishijada)
        setOdabranaLokacija('')
    })
}

async function obrisiLokaciju(lokacijaId) {
        
        const azuriraneLokacije = fishijada.lokacije.filter((id) => id !== lokacijaId)

        const izmjenjenaFishijada = { ...fishijada, lokacije: azuriraneLokacije }

        await FishijadaService.promjeni(sifra, izmjenjenaFishijada).then(() => {
            setFishijada(izmjenjenaFishijada)
        })
    }

async function ucitajPrijave() {
    await PrijavaService.get().then((odgovor)=>{
        setSvePrijave(odgovor.data)
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
                    onChange={(e)=>setOdabranaLokacija(e.target.value)}>
                    <option value="">Izaberi lokaciju</option>
                    {sveLokacije.map((l)=>{
                        const brojPrijava=svePrijave.filter(
                            p=>p.lokacija===l.sifra|| p.lokacijaSifra===l.sifra||p.lokacijaId===l.sifra).length
                        return(

                        <option key={l.sifra} value={l.sifra}>
                            {l.mjesto}({brojPrijava})
                            </option>
                        )
                    })}

                    </Form.Select>

                </Form.Group>

                <Button type="submit" variant = "success">
                    Dodaj lokaciju
                </Button>


            </Form>

            <h4 className="mt-4">Dodane lokacije</h4>
<Table hover striped bordered className="mt-3">
    <thead>
        <tr>
            <th>Naziv lokacije</th>
            <th>Akcija</th>
        </tr>
    </thead>
    <tbody>
        {fishijada.lokacije && fishijada.lokacije.map((lokacijaId) => {
            const lokacija = sveLokacije.find((l) => l.sifra === lokacijaId)
            return (
                <tr key={lokacijaId}>
                    <td>{lokacija ? lokacija.mjesto : 'Nepoznata lokacija'}</td>
                    <td>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => obrisiLokaciju(lokacijaId)}
                        >
                            Ukloni
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