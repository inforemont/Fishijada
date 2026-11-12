import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PrijavaService from "../../services/prijave/PrijavaService"
import { Button, Table, Container, Row, Col, Card, Pagination } from "react-bootstrap"
import { RouteNames } from "../../constants"
import useBreakpoint from "../../hooks/useBreakpoint"

export default function PrijavaDetalji() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const { sifra } = useParams()
    const navigate = useNavigate()
    
    const [prijava, setPrijava] = useState(null)
    const [slike, setSlike] = useState([])

    // Stanja za straničenje galerije (12 slika po stranici -> 3 u redu x 4 reda)
    const [trenutnaStranica, setTrenutnaStranica] = useState(1)
    const poStranici = 12

    useEffect(() => {
        ucitajDetalje()
    }, [sifra])

    async function ucitajDetalje() {
        await PrijavaService.getBySifra(sifra).then((odgovor) => {
            const data = odgovor.data
            setPrijava(data)
            // Ovdje dohvaćaš stvarne slike sa servera (ili ako testiraš, prebaci na `data.slike || []`)
            setSlike(data.slike || [])
        })
    }

    // Izračun za straničenje slika
    const zadnjiIndeks = trenutnaStranica * poStranici
    const prviIndeks = zadnjiIndeks - poStranici
    const trenutneSlike = slike.slice(prviIndeks, zadnjiIndeks)
    const ukupnoStranica = Math.ceil(slike.length / poStranici)

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
                            <td>{prijava.stol}</td>
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

            <h4 className="mt-4 mb-3 fs-5">Galerija fotografija (Ukupno: {slike.length} / 36)</h4>

            {slike.length === 0 ? (
                <p className="text-muted">Nema spremljenih fotografija za ovu prijavu.</p>
            ) : (
                <>
                    {/* Grid slika: md={4} znači 3 stupca u redu (3 x 4 reda = 12 slika) */}
                    <Row className="g-4 my-2">
                        {trenutneSlike.map((slika, index) => (
                            <Col xs={12} md={4} key={slika.id || index}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Img 
                                        variant="top" 
                                        src={slika.url || slika} 
                                        alt={`Slika ${index + 1}`}
                                        style={{ height: '220px', objectFit: 'cover' }}
                                    />
                                    <Card.Body className="text-center p-2">
                                        <Card.Title className="fs-6 mb-0 text-muted">Slika {prviIndeks + index + 1}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Prikaz navigacije stranica (Pagination) */}
                    {ukupnoStranica > 1 && (
                        <div className="d-flex justify-content-center my-4">
                            <Pagination>
                                <Pagination.First 
                                    disabled={trenutnaStranica === 1} 
                                    onClick={() => setTrenutnaStranica(1)} 
                                />
                                <Pagination.Prev 
                                    disabled={trenutnaStranica === 1} 
                                    onClick={() => setTrenutnaStranica((prev) => Math.max(prev - 1, 1))} 
                                />
                                
                                {[...Array(ukupnoStranica).keys()].map((broj) => (
                                    <Pagination.Item
                                        key={broj + 1}
                                        active={broj + 1 === trenutnaStranica}
                                        onClick={() => setTrenutnaStranica(broj + 1)}
                                    >
                                        {broj + 1}
                                    </Pagination.Item>
                                ))}

                                <Pagination.Next 
                                    disabled={trenutnaStranica === ukupnoStranica} 
                                    onClick={() => setTrenutnaStranica((prev) => Math.min(prev + 1, ukupnoStranica))} 
                                />
                                <Pagination.Last 
                                    disabled={trenutnaStranica === ukupnoStranica} 
                                    onClick={() => setTrenutnaStranica(ukupnoStranica)} 
                                />
                            </Pagination>
                        </div>
                    )}
                </>
            )}

            <Button 
                variant="secondary" 
                onClick={() => navigate(RouteNames.PRIJAVE)} 
                className={`mt-3 mb-4 ${jeMobitel ? 'w-100' : ''}`}
            >
                Natrag na pregled
            </Button>
        </Container>
    )
}