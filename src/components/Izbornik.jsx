import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { IME_APLIKACIJE, RouteNames } from '../constants';
import { useNavigate } from 'react-router-dom';

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
                        <NavDropdown title="Fishijade" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={()=> navigate(RouteNames.FISHIJADE, {state :{godina: null}})}>
                                <strong>Sve Fishijade</strong>
                                </NavDropdown.Item>
                        <NavDropdown.Divider />

                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2019 } })}
                            >
                                Fishijada 2019.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2020 } })}
                            >
                                Fishijada 2020.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2021 } })}
                            >
                                Fishijada 2021.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2022 } })}
                            >
                                Fishijada 2022.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2023 } })}
                            >
                                Fishijada 2023.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2024 } })}
                            >
                                Fishijada 2024.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2025 } })}
                            >
                                Fishijada 2025.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2026 } })}
                            >
                                Fishijada 2026.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2027 } })}
                            >
                                Fishijada 2027.
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link
                            onClick={() => navigate(RouteNames.O_APLIKACIJI)}
                        >
                            O Aplikaciji
                        </Nav.Link>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}