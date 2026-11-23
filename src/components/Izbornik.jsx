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
        <Navbar expand="lg" className="bg-body-tertiary shadow-sm px-3">
            <Container>
                <Navbar.Brand
                    onClick={() => navigate(RouteNames.HOME)}
                    style={{ cursor: 'pointer' }}
                >
                    {IME_APLIKACIJE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate(RouteNames.HOME)}>
                            Početna
                        </Nav.Link>

                        <NavDropdown title="Fišijade" id="basic-nav-dropdown">
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

                        <Nav.Link onClick={() => navigate(RouteNames.O_APLIKACIJI)}>
                            O Aplikaciji
                        </Nav.Link>

                        {isAdmin && (
                            <>
                                <Nav.Link onClick={() => navigate(RouteNames.GENERIRANJE)} className="d-flex align-items-center gap-1">
                                    <span style={{ fontSize: '1.2rem', marginRight: '4px', filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))' }}>✨</span>
                                    Generiranje podataka
                                </Nav.Link>
                                <Nav.Link onClick={() => navigate(RouteNames.KORISNICI)} className="text-warning fw-semibold d-flex align-items-center gap-1">
                                    ⚙️ Upravljanje Korisnicima
                                </Nav.Link>
                            </>
                        )}
                    </Nav>

                    <Nav className="ms-auto align-items-lg-center gap-2 mt-2 mt-lg-0">
                        {korisnik ? (
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <span className="navbar-text small">
                                    👤 {korisnik.ime || korisnik.email} <span className="badge bg-secondary">{korisnik.uloga}</span>
                                </span>
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
                        ) : (
                            <div className="d-flex gap-2">
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