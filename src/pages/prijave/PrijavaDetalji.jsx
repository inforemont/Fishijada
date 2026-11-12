import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PrijavaService from "../../services/prijave/PrijavaService"
import { Button, Table, Container } from "react-bootstrap"
import { RouteNames } from "../../constants"
import useBreakpoint from "../../hooks/useBreakpoint"

export default function PrijavaDetalji() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const { sifra } = useParams()
    const navigate = useNavigate()
    const [prijava, setPrijava] = useState(null)

    useEffect(() => {
        ucitajDetalje()
    }, [sifra])

    async function ucitajDetalje() {
        await PrijavaService.getBySifra(sifra).then((odgovor) => {
            setPrijava(odgovor.data)
        })
    }

    if (!prijava) {
        return <Container className="mt-3"><p>Učitavanje podataka...</p></Container>;
    }

    return (
        <Container className="px-2 px-md-3">
            <h3 className="my-3 fs-4 fs-md-3">Detalji prijave: {prijava.imePrezime} ({prijava.ekipa})</h3>
            
            <div className="table-responsive">
                <Table hover striped bordered className="mt-3 align-middle">
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
                            <td>{prijava.kotizacijaPlacena ? 'DA' : 'NE'}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <Button variant="secondary" onClick={() => navigate(RouteNames.PRIJAVE)} className="mt-3 mb-4">
                Natrag na pregled
            </Button>
        </Container>
    )
}