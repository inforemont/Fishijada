import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LokacijaService from "../../services/lokacije/LokacijaService";
import { Button, Table } from "react-bootstrap";
import { RouteNames } from "../../constants";

export default function LokacijaDetalji() {
    const { sifra } = useParams()
    const navigate = useNavigate()
    const [lokacija, setLokacija] = useState(null)

    useEffect(() => {
        ucitajDetalje()
    }, [sifra])

    async function ucitajDetalje() {
        await LokacijaService.getBySifra(sifra).then((odgovor) => {
            setLokacija(odgovor.data)
        })
    }

    if (!lokacija) {
        return <p className="mt-3">Učitavanje podataka...</p>;
    }

    return (
        <div>
            <h3 className="my-3">Detalji lokacije: {lokacija.mjesto}</h3>
            
            <Table hover striped bordered className="mt-3">
                <tbody>
                    <tr>
                        <td><strong>Regija:</strong></td>
                        <td>{lokacija.regija}</td>
                    </tr>
                    <tr>
                        <td><strong>Mjesto:</strong></td>
                        <td>{lokacija.mjesto}</td>
                    </tr>
                    <tr>
                        <td><strong>Županija:</strong></td>
                        <td>{lokacija.zupanija} </td>
                    </tr>
                    <tr>
                        <td><strong>Pošta:</strong></td>
                        <td>{lokacija.posta}</td>
                    </tr>
                                        <tr>
                        <td><strong>Datum održavanja:</strong></td>
                        <td>{lokacija.datumOdrzavanja}</td>
                    </tr>
                </tbody>
            </Table>

            <Button variant="secondary" onClick={() => navigate(RouteNames.LOKACIJE)} className="mt-3">
                Natrag na pregled
            </Button>
        </div>
    )
}