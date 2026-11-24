import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PrijavaService from "../../services/prijave/PrijavaService"
import { Button, Table, Container, Row, Col, Card, Pagination, Form, Modal, Alert } from "react-bootstrap"
import { RouteNames } from "../../constants"
import useBreakpoint from "../../hooks/useBreakpoint"
import Cropper from "react-cropper"
import "cropperjs/dist/cropper.css"

const galerijaSlike = import.meta.glob('../../assets/slikegalerija/*.jpg', { eager: true, import: 'default' });

function dohvatiSlikuGalerije(naziv) {
    if (!naziv) return null;

    // Ako je slika base64 string (korisnički upload / crop) ili pravi link, vrati je direktno
    if (naziv.startsWith('data:image') || naziv.startsWith('http://') || naziv.startsWith('https://')) {
        return naziv;
    }

    // Izvuci samo čisti naziv bez ekstenzije (npr. ako piše "1.jpg", ostaje "1")
    const cistiNaziv = String(naziv).replace(/\.[^/.]+$/, "");
    
    // Složi ključ kakav Vite očekuje u glob objektu
    const kljuc = `../../assets/slikegalerija/${cistiNaziv}.jpg`;

    // Vrati pronađenu sliku iz glob-a ili null ako ne postoji
    return galerijaSlike[kljuc] || null;
}

export default function PrijavaDetalji() {
    const breakpoint = useBreakpoint()
    const jeMobitel = breakpoint === 'xs' || breakpoint === 'sm'
    const { sifra } = useParams()
    const navigate = useNavigate()

    const [prijava, setPrijava] = useState(null)
    const [slike, setSlike] = useState([])
    const [korisnik, setKorisnik] = useState(null)

    const [trenutnaStranica, setTrenutnaStranica] = useState(1)
    const [brojPoStranici, setBrojPoStranici] = useState(12)

    const [prikaziModal, setPrikaziModal] = useState(false)
    const [aktivnaSlika, setAktivnaSlika] = useState(null)

    const [prikaziCropModal, setPrikaziCropModal] = useState(false)
    const [aktivnaSlikaZaCrop, setAktivnaSlikaZaCrop] = useState(null)
    const [aktivniIndexSlike, setAktivniIndexSlike] = useState(null)
    const cropperRef = useRef(null)

    const [greskaUploada, setGreskaUploada] = useState('')
    const [uspjehUploadaModal, setUspjehUploadaModal] = useState(false)
    const [slikaZaBrisanjeIndex, setSlikaZaBrisanjeIndex] = useState(null)
    const [potvrdaBrisanjaSlikaModal, setPotvrdaBrisanjaSlikaModal] = useState(false)

    useEffect(() => {
        const spremljeniKorisnik = localStorage.getItem("prijavljeniKorisnik")
        if (spremljeniKorisnik) {
            setKorisnik(JSON.parse(spremljeniKorisnik))
        }
        ucitajDetalje()
    }, [sifra])

    async function ucitajDetalje() {
        try {
            const odgovor = await PrijavaService.getBySifra(sifra)
            

            if (!odgovor || !odgovor.data) {
                setPrijava(null)
                setSlike([])
                return
            }

            const data = odgovor.data
            setPrijava(data)
            
            const ucitaneSlike = (data.slike || []).map(s => typeof s === 'string' ? { url: s } : s)
            setSlike(ucitaneSlike)
        } catch (err) {
            console.error("Greška pri učitavanju detalja:", err)
        }
    }


    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })

    async function dodajNoveFotografije(e) {
        const files = Array.from(e.target.files)
        setGreskaUploada('')

        if (slike.length + files.length > 36) {
            setGreskaUploada(`Maksimalan broj fotografija je 36. Trenutno ih imate ${slike.length}, a pokušali ste dodati još ${files.length}.`)
            return
        }

        const dozvoljeniFormati = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
        const nepropisanFormat = files.some(file => !dozvoljeniFormati.includes(file.type))
        if (nepropisanFormat) {
            setGreskaUploada('Dopušteni su samo popularni formati fotografija (JPEG, JPG, PNG, WEBP, AVIF).')
            return
        }

        const previseVelika = files.some(file => file.size > 5 * 1024 * 1024)
        if (previseVelika) {
            setGreskaUploada('Jedna ili više fotografija prelazi maksimalnu veličinu od 5 MB.')
            return
        }

        try {
            const base64Promises = files.map(file => toBase64(file))
            const base64Results = await Promise.all(base64Promises)

            const noveSlikeObjekti = base64Results.map(base64 => ({ url: base64 }))
            const azuriraneSlike = [...slike, ...noveSlikeObjekti]
            
            const izmjenjenaPrijava = { 
                ...prijava, 
                slike: azuriraneSlike.map(s => s.url) 
            }

            await PrijavaService.promjeni(sifra, izmjenjenaPrijava)

            setSlike(azuriraneSlike)
            setPrijava(izmjenjenaPrijava)
            setUspjehUploadaModal(true)
        } catch (err) {
            console.error("Greška kod uploada slika:", err)
            setGreskaUploada('Došlo je do greške prilikom učitavanja fotografija na bazu.')
        }
    }

    function pokreniBrisanjeSlika(stvarniIndex) {
        setSlikaZaBrisanjeIndex(stvarniIndex)
        setPotvrdaBrisanjaSlikaModal(true)
    }

    async function potvrdiBrisanjeSlike() {
        if (slikaZaBrisanjeIndex === null) return

        try {
            const azuriraneSlike = slike.filter((_, idx) => idx !== slikaZaBrisanjeIndex)
            const izmjenjenaPrijava = { 
                ...prijava, 
                slike: azuriraneSlike.map(s => s.url) 
            }
            
            await PrijavaService.promjeni(sifra, izmjenjenaPrijava)

            setSlike(azuriraneSlike)
            setPrijava(izmjenjenaPrijava)
            setPotvrdaBrisanjaSlikaModal(false)
            setSlikaZaBrisanjeIndex(null)
        } catch (err) {
            console.error("Greška kod brisanja slike:", err)
            setPotvrdaBrisanjaSlikaModal(false)
            alert("Došlo je do greške prilikom brisanja fotografije.")
        }
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
        const siroviUrl = slika.url || slika;
        setAktivnaSlika(dohvatiSlikuGalerije(siroviUrl))
        setPrikaziModal(true)
    }

    const otvoriCrop = (slika, indexNaStranici) => {
        const url = slika.url || slika;
        setAktivnaSlikaZaCrop(dohvatiSlikuGalerije(url));
        const stvarniIndex = prviIndeks + indexNaStranici;
        setAktivniIndexSlike(stvarniIndex);
        setPrikaziCropModal(true);
    }

    const spremiIzrezanuSliku = async () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas();
            const croppedImageUrl = croppedCanvas.toDataURL();

            const noveSlike = [...slike];
            noveSlike[aktivniIndexSlike] = { url: croppedImageUrl };

            const izmjenjenaPrijava = { 
                ...prijava, 
                slike: noveSlike.map(s => s.url) 
            }
            
            await PrijavaService.promjeni(sifra, izmjenjenaPrijava)

            setSlike(noveSlike);
            setPrijava(izmjenjenaPrijava);
            setPrikaziCropModal(false);
        }
    }

    if (!prijava) {
        return <Container className="mt-3"><p>Učitavanje podataka...</p></Container>;
    }

    const dohvatiSirinuStupca = () => {
        if (brojPoStranici === 3) return 12
        if (brojPoStranici === 6) return 6
        return 4
    }

    const isAdmin = korisnik?.uloga === "Admin"
    const jeVlasnik = korisnik && prijava.korisnikSifra && String(prijava.korisnikSifra) === String(korisnik.sifra)
    
    const smijeDodavatiSlike = !isAdmin && jeVlasnik
    const smijeUredivatiSlike = isAdmin || jeVlasnik

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
                <h4 className="fs-5 mb-0">Galerija fotografija (Ukupno: {slike.length} / 36)</h4>

                <div className="d-flex align-items-center gap-3 flex-wrap">
                    {smijeDodavatiSlike && slike.length < 36 && (
                        <div>
                            <input
                                type="file"
                                id="dodaj-slike-input"
                                multiple
                                accept="image/jpeg, image/jpg, image/png, image/webp, image/avif"
                                style={{ display: 'none' }}
                                onChange={dodajNoveFotografije}
                            />
                            <Button
                                variant="success"
                                size="sm"
                                className="rounded-pill px-3 fw-bold shadow-sm"
                                onClick={() => document.getElementById('dodaj-slike-input').click()}
                            >
                                ➕ Dodaj još fotografija
                            </Button>
                        </div>
                    )}

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
            </div>

            {greskaUploada && <Alert variant="danger" className="py-2">{greskaUploada}</Alert>}

            {slike.length === 0 ? (
                <p className="text-muted">Nema spremljenih fotografija za ovu prijavu.</p>
            ) : (
                <>
                    <Row className="g-4 my-2">
                        {trenutneSlike.map((slika, index) => {
                            const siroviUrl = slika.url || slika;
                            const imageUrl = dohvatiSlikuGalerije(siroviUrl);
                            const stvarniIndex = prviIndeks + index;
                            return (
                                <Col xs={12} md={dohvatiSirinuStupca()} key={index}>
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
                                                alt={`Slika ${stvarniIndex + 1}`}
                                                style={{
                                                    maxHeight: '100%',
                                                    maxWidth: '100%',
                                                    objectFit: 'contain',
                                                    transition: 'transform 0.2s ease-in-out'
                                                }}
                                            />
                                        </div>
                                        <Card.Body className="text-center p-2 bg-light d-flex flex-column justify-content-between">
                                            <div>
                                                <Card.Title className="fs-6 mb-0 text-secondary">
                                                    Slika {stvarniIndex + 1}
                                                </Card.Title>
                                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Pritisni za zoom</small>
                                            </div>

                                            {smijeUredivatiSlike && (
                                                <div className="d-flex gap-2 mt-2 justify-content-center">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="rounded-pill fw-semibold w-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            otvoriCrop(slika, index);
                                                        }}
                                                    >
                                                        ✂️ Crop
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        className="rounded-pill fw-semibold w-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            pokreniBrisanjeSlika(stvarniIndex);
                                                        }}
                                                    >
                                                        🗑️ Obriši
                                                    </Button>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>

                    {ukupnoStranica > 1 && (
                        <div className="d-flex justify-content-center my-4">
                            <Pagination>
                                <Pagination.First disabled={trenutnaStranica === 1} onClick={() => setTrenutnaStranica(1)} />
                                <Pagination.Prev disabled={trenutnaStranica === 1} onClick={() => setTrenutnaStranica((prev) => Math.max(prev - 1, 1))} />
                                {[...Array(ukupnoStranica).keys()].map((broj) => (
                                    <Pagination.Item key={broj + 1} active={broj + 1 === trenutnaStranica} onClick={() => setTrenutnaStranica(broj + 1)}>
                                        {broj + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next disabled={trenutnaStranica === ukupnoStranica} onClick={() => setTrenutnaStranica((prev) => Math.min(prev + 1, ukupnoStranica))} />
                                <Pagination.Last disabled={trenutnaStranica === ukupnoStranica} onClick={() => setTrenutnaStranica(ukupnoStranica)} />
                            </Pagination>
                        </div>
                    )}
                </>
            )}

            {/* Modali */}
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

            <Modal show={potvrdaBrisanjaSlikaModal} onHide={() => setPotvrdaBrisanjaSlikaModal(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title className="fw-bold fs-5">⚠️ Potvrda brisanja slike</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <p className="fs-5 mb-0">Jeste li sigurni da želite obrisati ovu fotografiju iz galerije?</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center border-0 pb-3">
                    <Button variant="secondary" className="rounded-pill px-4" onClick={() => setPotvrdaBrisanjaSlikaModal(false)}>
                        Odustani
                    </Button>
                    <Button variant="danger" className="rounded-pill px-4 fw-bold shadow-sm" onClick={potvrdiBrisanjeSlike}>
                        Obriši
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={uspjehUploadaModal} centered backdrop="static">
                <Modal.Header className="bg-primary text-white">
                    <Modal.Title className="fw-bold fs-5">✨ Uspješan prijenos</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-5 bg-white rounded-4 shadow-lg">
                    <div className="mb-3" style={{ fontSize: "3rem" }}>📸🎉</div>
                    <h4 className="fw-bold text-success mb-2">Fotografije uspješno dodane!</h4>
                    <p className="text-muted mb-0">Vaša galerija je uspješno osvježena novim slikama.</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center border-0 pb-3">
                    <Button 
                        variant="success" 
                        className="rounded-pill px-4 fw-bold shadow-sm"
                        onClick={() => setUspjehUploadaModal(false)}
                    >
                        U redu
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