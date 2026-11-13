import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import { IME_APLIKACIJE, RouteNames } from '../constants'
import { useNavigate } from 'react-router-dom'

export default function Izbornik() {
    const navigate = useNavigate();
    const [korisnik, setKorisnik] = useState(null);

    useEffect(() => {
        const ucitajKorisnika = () => {
            const spremljeno = localStorage.getItem("prijavljeniKorisnik");
            setKorisnik(spremljeno ? JSON.parse(spremljeno) : null);
        };

        ucitajKorisnika();
        window.addEventListener("authPromjena", ucitajKorisnika);
        return () => window.removeEventListener("authPromjena", ucitajKorisnika);
    }, []);

    const odjaviSe = () => {
        localStorage.removeItem("prijavljeniKorisnik");
        setKorisnik(null);
        window.dispatchEvent(new Event("authPromjena"));
        navigate(RouteNames.HOME);
    };

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
                        <Nav.Link
                            onClick={() => navigate(RouteNames.HOME)}
                        >
                            Početna
                        </Nav.Link>
                        <NavDropdown title="Fišijade" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={()=> navigate(RouteNames.FISHIJADE, {state :{godina: null}})}>
                                <strong>Prvenstvo Baranje</strong>
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> navigate(RouteNames.PRIJAVE, {state :{godina: null}})}>
                                <strong>Prijave</strong>
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> navigate(RouteNames.LOKACIJE, {state :{godina: null}})}>
                                <strong>Baranjske Fišijade</strong>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link
                            onClick={() => navigate(RouteNames.O_APLIKACIJI)}
                        >
                            O Aplikaciji
                        </Nav.Link>
                        <Nav.Link onClick={()=>navigate(RouteNames.GENERIRANJE)}>Generiranje podataka</Nav.Link>
                    </Nav>

                    <Nav className="ms-auto align-items-lg-center gap-2 mt-2 mt-lg-0">
                        {korisnik ? (
                            <>
                                <span className="navbar-text small me-2">
                                    👤 Pozdrav, <strong className="text-primary">{korisnik.ime || korisnik.email}</strong>
                                    <Nav.Link onClick={()=>navigate(RouteNames.PROFIL)}>Vaš Profil</Nav.Link>
                                </span>
                                <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    className="rounded-pill px-3"
                                    onClick={odjaviSe}
                                >
                                    Odjava
                                </Button>
                            </>
                        ) : (
                            <Button 
                                variant="warning" 
                                size="sm" 
                                className="fw-bold text-dark rounded-pill px-4 shadow-sm"
                                onClick={() => navigate(RouteNames.LOGIN)}
                            >
                                🔐 Prijava
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}