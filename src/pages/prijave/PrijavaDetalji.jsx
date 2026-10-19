import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FishijadaService from "../../services/FishijadaService";
import { Button, Table } from "react-bootstrap";
import { RouteNames } from "../../constants";

export default function FishijadaDetalji() {
    const { sifra } = useParams()
    const navigate = useNavigate()
    const [fishijada, setFishijada] = useState(null)

    useEffect(() => {
        ucitajDetalje()
    }, [sifra]);

    async function ucitajDetalje() {
        await FishijadaService.getBySifra(sifra).then((odgovor) => {
            setFishijada(odgovor.data)
        })
    }

    if (!fishijada) {
        return <p className="mt-3">Učitavanje podataka...</p>;
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

            <Button variant="secondary" onClick={() => navigate(RouteNames.FISHIJADE)} className="mt-3">
                Natrag na pregled
            </Button>
        </div>
    );
}