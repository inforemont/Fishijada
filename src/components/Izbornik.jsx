import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { IME_APLIKACIJE } from '../constants';





//* vezemo Izbornik
export default function Izbornik() {



    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">
                    {IME_APLIKACIJE}
                    </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Početna</Nav.Link>
                        <NavDropdown title="Fishijade" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Fishijada 2019.</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Fishijada 2020.</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Fishijada 2021.</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Fishijada 2022.</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Fishijada 2023.</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Fishijada 2024.</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Fishijada 2025.</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Fishijada 2026.</NavDropdown.Item>
                            
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    )

}