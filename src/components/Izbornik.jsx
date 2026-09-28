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
                        <NavDropdown title="Fišijade" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={()=> navigate(RouteNames.FISHIJADE, {state :{godina: null}})}>
                                <strong>Sve Fišijade</strong>
                                </NavDropdown.Item>
                        <NavDropdown.Divider />

                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2019 } })}
                            >
                                Fišijada 2019.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2020 } })}
                            >
                                Fišijada 2020.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2021 } })}
                            >
                                Fišijada 2021.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2022 } })}
                            >
                                Fišijada 2022.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2023 } })}
                            >
                                Fišijada 2023.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2024 } })}
                            >
                                Fišijada 2024.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2025 } })}
                            >
                                Fišijada 2025.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2026 } })}
                            >
                                Fišijada 2026.
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.FISHIJADE, { state: { godina: 2027 } })}
                            >
                                Fišijada 2027.
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