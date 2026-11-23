import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import { IME_APLIKACIJE, RouteNames } from '../constants'
import { useNavigate } from 'react-router-dom'

export default function Izbornik() {
    const navigate = useNavigate()
    const [korisnik, setKorisnik] = useState(null)

    useEffect(() => {
        const ucitajKorisnika = () => {
            const spremljeno = localStorage.getItem("prijavljeniKorisnik")
            setKorisnik(spremljeno ? JSON.parse(spremljeno) : null)
        }

        ucitajKorisnika()
        window.addEventListener("authPromjena", ucitajKorisnika)
        return () => window.removeEventListener("authPromjena", ucitajKorisnika)
    }, [])

    const odjaviSe = () => {
        localStorage.removeItem("prijavljeniKorisnik");
        setKorisnik(null);
        window.dispatchEvent(new Event("authPromjena"));
        navigate(RouteNames.HOME);
    }

    const isAdmin = korisnik?.uloga === "Admin";

    return (
        <Navbar expand="lg" className="bg-body-tertiary shadow-sm px-3 py-2">
            <style>
                {`
                    @media (min-width: 992px) {
                        .navbar-nav .nav-link, .navbar-nav .dropdown {
                            display: flex;
                            align-items: center;
                            height: 100%;
                        }
                    }
                `}
            </style>
            <Container fluid>
                <Navbar.Brand
                    onClick={() => navigate(RouteNames.HOME)}
                    style={{ cursor: 'pointer' }}
                    className="fw-bold text-success fs-5 m-0"
                >
                    {IME_APLIKACIJE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto align-items-lg-center">
                        <Nav.Link onClick={() => navigate(RouteNames.HOME)} className="py-2 px-2">
                            Početna
                        </Nav.Link>

                        <NavDropdown title="Fišijade" id="basic-nav-dropdown" className="py-2 px-2">
                            <NavDropdown.Item onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: null } })}>
                                <strong>Prvenstvo Baranje</strong>
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate(RouteNames.PRIJAVE, { state: { godina: null } })}>
                                <strong>Prijave</strong>
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate(RouteNames.LOKACIJE, { state: { godina: null } })}>
                                <strong>Baranjske Fišijade</strong>
                            </NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link onClick={() => navigate(RouteNames.O_APLIKACIJI)} className="py-2 px-2">
                            O Aplikaciji
                        </Nav.Link>

                        {isAdmin && (
                            <>
                                <Nav.Link onClick={() => navigate(RouteNames.GENERIRANJE)} className="d-flex align-items-center gap-1 py-2 px-2">
                                    <span style={{ fontSize: '1.2rem', marginRight: '2px' }}>✨</span>
                                    Generiranje podataka
                                </Nav.Link>
                                <Nav.Link onClick={() => navigate(RouteNames.KORISNICI)} className="text-warning fw-semibold d-flex align-items-center gap-1 py-2 px-2">
                                    ⚙️ Upravljanje Korisnicima
                                </Nav.Link>
                            </>
                        )}
                    </Nav>

                    <Nav className="ms-auto align-items-lg-center gap-2 mt-3 mt-lg-0">
                        {korisnik ? (
                            <div className="d-flex align-items-center gap-2 flex-wrap pb-2 pb-lg-0">
                                <div className="d-flex align-items-center bg-light border px-2 py-1 rounded-pill small">
                                    <span className="me-1">👤</span>
                                    <span className="fw-semibold text-dark me-2">{korisnik.ime || korisnik.email}</span>
                                    <span className="badge bg-success">{korisnik.uloga}</span>
                                </div>
                                <div className="d-flex gap-1">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="rounded-pill px-3"
                                        onClick={() => navigate(RouteNames.PROFIL)}
                                    >
                                        Profil
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="rounded-pill px-3"
                                        onClick={odjaviSe}
                                    >
                                        Odjava
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex gap-2 pb-2 pb-lg-0">
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    className="rounded-pill px-3"
                                    onClick={() => navigate(RouteNames.REGISTRACIJA)}
                                >
                                    Registracija
                                </Button>
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="fw-bold rounded-pill px-4 shadow-sm"
                                    onClick={() => navigate(RouteNames.LOGIN)}
                                >
                                    🔐 Prijava
                                </Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}