import { IME_APLIKACIJE } from '../constants'
import { Container, Card, Carousel, Row, Col, Badge, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { RouteNames } from '../constants'
import pozadinaKartice from '../assets/baranja.jpg'

import slika1 from '../assets/paprika.jpg'
import slika2 from '../assets/pozadina_ribe.jpg'
import slika3 from '../assets/baranja.jpg'
import slika4 from '../assets/najveca.jpg'

export default function Home() {
    const navigate = useNavigate()

    return (
        <Container className="my-5">
            <div className="position-relative rounded-5 overflow-hidden shadow-2xl mb-5 border border-white border-opacity-10">
                <div
                    className="position-absolute w-100 h-100"
                    style={{
                        backgroundImage: `url(${pozadinaKartice})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.55) contrast(1.15)',
                        transform: 'scale(1.02)'
                    }}
                />
                <div
                    className="position-absolute w-100 h-100"
                    style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.75) 100%)',
                        backdropFilter: 'blur(6px)'
                    }}
                />

                <div className="position-relative z-index-1 p-4 p-md-5 text-center text-white">
                    <div className="mb-3">
                        <Badge bg="danger" className="px-3 py-2 rounded-pill fw-medium shadow-sm fs-6">
                            🔴 Live • Sezona Baranjskih Fišijada
                        </Badge>
                    </div>

                    <h1 className="fw-bold display-5 mb-3 text-white">
                        Dobrodošli na <span className="text-warning">{IME_APLIKACIJE}</span>
                    </h1>
                    <p className="lead text-light opacity-85 mx-auto mb-4" style={{ maxWidth: '680px', fontWeight: 300 }}>
                        Središnji portal za prijave te praćenje rezultata hrvatskih fišijada.
                    </p>

                    <div className="mx-auto" style={{ maxWidth: "850px" }}>
                        <Carousel
                            fade
                            interval={4000}
                            className="shadow-lg rounded-4 overflow-hidden border border-white border-opacity-20"
                        >
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={slika1}
                                    alt="Posjeti Baranju"
                                    style={{ height: "400px", objectFit: "cover" }}
                                />
                                <Carousel.Caption className="bg-dark bg-opacity-75 rounded-3 py-2 px-3 mx-4 mb-3">
                                    <h5 className="mb-0 text-white fw-semibold fs-6">🍂 Autentične baranjske začinske paprike</h5>
                                </Carousel.Caption>
                            </Carousel.Item>

                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={slika2}
                                    alt="Uzbudi osjetila"
                                    style={{ height: "400px", objectFit: "cover" }}
                                />
                                <Carousel.Caption className="bg-dark bg-opacity-75 rounded-3 py-2 px-3 mx-4 mb-3">
                                    <h5 className="mb-0 text-white fw-semibold fs-6">🔥 Priprema vrhunskog tradicionalnog fiša</h5>
                                </Carousel.Caption>
                            </Carousel.Item>

                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={slika3}
                                    alt="Spoj prirode i okusa"
                                    style={{ height: "400px", objectFit: "cover" }}
                                />
                                <Carousel.Caption className="bg-dark bg-opacity-75 rounded-3 py-2 px-3 mx-4 mb-3">
                                    <h5 className="mb-0 text-white fw-semibold fs-6">🌿 Spoj netaknute prirode i bogatih okusa</h5>
                                </Carousel.Caption>
                            </Carousel.Item>

                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={slika4}
                                    alt="Grad Fiša"
                                    style={{ height: "400px", objectFit: "cover" }}
                                />
                                <Carousel.Caption className="bg-dark bg-opacity-75 rounded-3 py-2 px-3 mx-4 mb-3">
                                    <h5 className="mb-0 text-white fw-semibold fs-6">🏆 Beli Manastir – Prijestolnica i Grad Fiša</h5>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
            </div>

            <Row className="g-4 justify-content-center">

                <Col xs={12} md={4}>
                    <div className="animate-bulletin delay-1 h-100">
                        <Card className="h-100 border-0 shadow-lg rounded-4 p-4 text-white d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderLeft: '5px solid #3b82f6' }}>
                            <Card.Body className="p-0">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fs-2">🐟</span>
                                    <Badge bg="primary" className="px-2 py-1 rounded-pill">Aktualno</Badge>
                                </div>
                                <span className="text-uppercase text-primary fw-bold small">Lokalne Fišijade</span>
                                <h3 className="fw-bold mb-2 text-white fs-4">Prijave u tijeku</h3>
                                <p className="text-muted small mb-3">Otvorene prijave ekipa i upravljanje kotizacijama za lokalne fišijade.</p>
                            </Card.Body>
                            <div className="pt-2">
                                <Button
                                    variant="success"
                                    className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill shadow-sm btn-hover-zoom"
                                    onClick={() => navigate(RouteNames.PRIJAVA_NOVI)}
                                >
                                    Prijavi se <span>&rarr;</span>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </Col>

                <Col xs={12} md={4}>
                    <div className="animate-bulletin delay-2 h-100">
                        <Card className="h-100 border-0 shadow-lg rounded-4 p-4 text-white d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderLeft: '5px solid #10b981' }}>
                            <Card.Body className="p-0">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fs-2">🏆</span>
                                    <Badge bg="success" className="px-2 py-1 rounded-pill">Tradicija</Badge>
                                </div>
                                <span className="text-uppercase text-success fw-bold small">Prvenstvo Baranje</span>
                                <h3 className="fw-bold mb-2 text-white fs-4">Od osnutka 2019.</h3>
                                <p className="text-muted small mb-3">Arhiva i pregled svih dosadašnjih regionalnih natjecanja po godinama.</p>
                            </Card.Body>
                            <div className="pt-2">
                                <Button
                                    variant="outline-light"
                                    className="w-100 fw-bold py-2 rounded-pill shadow-sm btn-hover-zoom"
                                    onClick={() => navigate(RouteNames.FISHIJADA_PREGLED)}
                                >
                                    Vidi više
                                </Button>
                            </div>
                        </Card>
                    </div>
                </Col>

                <Col xs={12} md={4}>
                    <div className="animate-bulletin delay-3 h-100">
                        <Card className="h-100 border-0 shadow-lg rounded-4 p-4 text-white d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderLeft: '5px solid #f59e0b' }}>
                            <Card.Body className="p-0">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fs-2">⭐</span>
                                    <Badge bg="warning" text="dark" className="px-2 py-1 rounded-pill fw-semibold">Finale</Badge>
                                </div>
                                <span className="text-uppercase text-warning fw-bold small">Prvenstvo Hrvatske</span>
                                <h3 className="fw-bold mb-2 text-white fs-4">Beli Manastir</h3>
                                <p className="text-light opacity-75 small mb-3">Završni susret u sklopu kojeg sudjeluju pobjednici svih regionalnih fišijada.</p>
                            </Card.Body>
                            <div className="pt-2">
                                <div
                                    className="text-white text-center py-2 px-3 rounded-pill fw-bold small animate-jubilee"
                                    style={{
                                        backgroundColor: 'rgba(245, 158, 11, 0.25)',
                                        border: '1px solid #f59e0b'
                                    }}
                                >
                                    <span className="spin-icon me-1">✨</span> Već 9. godinu za redom!
                                </div>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}