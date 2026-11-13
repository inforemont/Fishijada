import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PrijavaService from "../../services/prijave/PrijavaService"
import { Button, Table, Container, Row, Col, Card, Pagination, Form, Modal } from "react-bootstrap"
import { RouteNames } from "../../constants"
import useBreakpoint from "../../hooks/useBreakpoint"
import Cropper from "react-cropper"
import "cropperjs/dist/cropper.css"

export default function PrijavaDetalji() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const { sifra } = useParams()
    const navigate = useNavigate()
    
    const [prijava, setPrijava] = useState(null)
    const [slike, setSlike] = useState([])

    const [trenutnaStranica, setTrenutnaStranica] = useState(1)
    const [brojPoStranici, setBrojPoStranici] = useState(12)

    const [prikaziModal, setPrikaziModal] = useState(false)
    const [aktivnaSlika, setAktivnaSlika] = useState(null)

    const [prikaziCropModal, setPrikaziCropModal] = useState(false)
    const [aktivnaSlikaZaCrop, setAktivnaSlikaZaCrop] = useState(null)
    const [aktivniIndexSlike, setAktivniIndexSlike] = useState(null)
    const cropperRef = useRef(null)

    useEffect(() => {
        ucitajDetalje()
    }, [sifra])

    async function ucitajDetalje() {
        await PrijavaService.getBySifra(sifra).then((odgovor) => {
            const data = odgovor.data
            setPrijava(data)
            setSlike(data.slike || [])
        })
    }

    const promjeniBrojPoStranici = (e) => {
        setBrojPoStranici(Number(e.target.value))
        setTrenutnaStranica(1)
    }

    const zadnjiIndeks = trenutnaStranica * brojPoStranici
    const prviIndeks = zadnjiIndeks - brojPoStranici
    const trenutneSlike = slike.slice(prviIndeks, zadnjiIndeks)
    const ukupnoStranica = Math.ceil(slike.length / brojPoStranici)

    const otvoriZumiranje = (slika) => {
        setAktivnaSlika(slika.url || slika)
        setPrikaziModal(true)
    }

    const otvoriCrop = (slika, indexNaStranici) => {
        const url = slika.url || slika;
        setAktivnaSlikaZaCrop(url);
        const stvarniIndex = prviIndeks + indexNaStranici;
        setAktivniIndexSlike(stvarniIndex);
        setPrikaziCropModal(true);
    }

    const spremiIzrezanuSliku = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas();
            const croppedImageUrl = croppedCanvas.toDataURL();

            const noveSlike = [...slike];
            if (typeof noveSlike[aktivniIndexSlike] === 'object' && noveSlike[aktivniIndexSlike] !== null) {
                noveSlike[aktivniIndexSlike] = { ...noveSlike[aktivniIndexSlike], url: croppedImageUrl };
            } else {
                noveSlike[aktivniIndexSlike] = croppedImageUrl;
            }

            setSlike(noveSlike);
            setPrikaziCropModal(false);
        }
    }

    if (!prijava) {
        return <Container className="mt-3"><p>Učitavanje podataka...</p></Container>;
    }

    const dohvatiSirinuStupca = () => {
        if (brojPoStranici === 3) return 12
        if (brojPoStranici === 6) return 6
        return 4;
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

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-4 mb-3 gap-3">
                <h4 className="fs-5 mb-0">Galerija fotografija (Ukupno: {slike.length})</h4>
                
                {slike.length > 0 && (
                    <div className="d-flex align-items-center gap-2">
                        <Form.Label className="mb-0 text-nowrap fs-6">Prikaži po:</Form.Label>
                        <Form.Select 
                            value={brojPoStranici} 
                            onChange={promjeniBrojPoStranici}
                            style={{ width: '100px' }}
                        >
                            <option value={3}>3</option>
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                        </Form.Select>
                    </div>
                )}
            </div>

            {slike.length === 0 ? (
                <p className="text-muted">Nema spremljenih fotografija za ovu prijavu.</p>
            ) : (
                <>
                    <Row className="g-4 my-2">
                        {trenutneSlike.map((slika, index) => {
                            const imageUrl = slika.url || slika;
                            return (
                                <Col xs={12} md={dohvatiSirinuStupca()} key={slika.id || index}>
                                    <Card className="h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                                        <div 
                                            style={{ 
                                                height: brojPoStranici === 3 ? '400px' : '230px', 
                                                backgroundColor: '#f8f9fa', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden'
                                            }}
                                            onClick={() => otvoriZumiranje(slika)}
                                            title="Klikni za uvećanje"
                                        >
                                            <Card.Img 
                                                variant="top" 
                                                src={imageUrl} 
                                                alt={`Slika ${prviIndeks + index + 1}`}
                                                style={{ 
                                                    maxHeight: '100%', 
                                                    maxWidth: '100%', 
                                                    objectFit: 'contain',
                                                    transition: 'transform 0.2s ease-in-out'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                        <Card.Body className="text-center p-2 bg-light d-flex flex-column justify-content-between">
                                            <div>
                                                <Card.Title className="fs-6 mb-0 text-secondary">
                                                    Slika {prviIndeks + index + 1}
                                                </Card.Title>
                                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Pritisni za zoom</small>
                                            </div>
                                            
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="mt-2 rounded-pill fw-semibold"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    otvoriCrop(slika, index);
                                                }}
                                            >
                                                ✂️ Izreži (Crop)
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>

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

            <Modal show={prikaziModal} onHide={() => setPrikaziModal(false)} size="lg" centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-6 text-muted">Pregled fotografije</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center p-3">
                    {aktivnaSlika && (
                        <img 
                            src={aktivnaSlika} 
                            alt="Uvećana slika" 
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: '80vh', objectFit: 'contain' }}
                        />
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={prikaziCropModal} onHide={() => setPrikaziCropModal(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-5">Obrezivanje fotografije (Crop)</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ minHeight: '400px' }}>
                    {aktivnaSlikaZaCrop && (
                        <div style={{ width: '100%', maxHeight: '60vh', overflow: 'hidden' }}>
                            <Cropper
                                ref={cropperRef}
                                src={aktivnaSlikaZaCrop}
                                style={{ height: 450, width: '100%' }}
                                aspectRatio={NaN}
                                guides={true}
                                viewMode={1}
                                dragMode="crop"
                                scalable={true}
                                zoomable={true}
                                background={true}
                                responsive={true}
                                autoCropArea={0.8}
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setPrikaziCropModal(false)}>
                        Odustani
                    </Button>
                    <Button variant="success" onClick={spremiIzrezanuSliku}>
                        Spremi izrezano
                    </Button>
                </Modal.Footer>
            </Modal>

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