import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrijavaService from "../../services/prijave/PrijavaService";
import { Button, Table } from "react-bootstrap";
import { RouteNames } from "../../constants";

export default function PrijavaDetalji() {
    const { sifra } = useParams()
    const navigate = useNavigate()
    const [prijava, setPrijava] = useState(null)

    useEffect(() => {
        ucitajDetalje()
    }, [sifra]);

    async function ucitajDetalje() {
        await PrijavaService.getBySifra(sifra).then((odgovor) => {
            setPrijava(odgovor.data)
        })
    }

    if (!prijava) {
        return <p className="mt-3">Učitavanje podataka...</p>;
    }

    return (
        <div>
            <h3 className="my-3">Detalji prijave: {prijava.naziv}</h3>
            
            <Table hover striped bordered className="mt-3">
                <tbody>
                    <tr>
                        <td><strong>Ime i Prezime:</strong></td>
                        <td>{prijava.imePrezime}</td>
                    </tr>
                    <tr>
                        <td><strong>Ekipa:</strong></td>
                        <td>{prijava.ekipa}</td>
                    </tr>
                    <tr>
                        <td><strong>Stol:</strong></td>
                        <td>{prijava.stol} </td>
                    </tr>
                    <tr>
                        <td><strong>E-mail:</strong></td>
                        <td>{prijava.email}</td>
                    </tr>
                    <tr>
                        <td><strong>Kotizacija uplaćena?:</strong></td>
                        <td>{prijava.kotizacijaPlacena ? 'Aktivna' : 'Neaktivna'}</td>
                    </tr>
                    <tr>
                        <td><strong>Prvenstvo Hrvatske?:</strong></td>
                        <td>{prijava.prvenstvoHrvatske ? 'Aktivna' : 'Neaktivna'}</td>
                    </tr>
                </tbody>
            </Table>

            <Button variant="secondary" onClick={() => navigate(RouteNames.PRIJAVE)} className="mt-3">
                Natrag na pregled
            </Button>
        </div>
    );
}