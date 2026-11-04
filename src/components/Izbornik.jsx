import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { IME_APLIKACIJE, RouteNames } from '../constants';
import { useNavigate, Link } from 'react-router-dom';

export default function Izbornik() {

    const navigate = useNavigate();

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">
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
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}