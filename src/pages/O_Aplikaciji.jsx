import { Container, Row, Col, Card, Badge, ListGroup, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { RouteNames } from "../constants"



export default function O_Aplikaciji() {
    const navigate = useNavigate()

    return (
        <Container className="py-4 px-2 px-md-3">
            <Card className="border-0 shadow-sm bg-light mb-4 rounded-4">
                <Card.Body className="p-4 p-md-5 text-center">
                    <Badge bg="danger" className="mb-2 px-3 py-2 text-uppercase">
                        Baranjska tradicija & natjecanja
                    </Badge>
                    <h2 className="fw-bold mb-3">Aplikacija za praćenje Baranjskih fišijada</h2>
                    <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '750px' }}>
                        Centralno mjesto za organizaciju, praćenje i prijavu na sve aktualne baranjske fišijade 
                        te arhivu dosadašnjih natjecanja.
                    </p>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <Button 
                            variant="danger" 
                            onClick={() => navigate(RouteNames.PRIJAVE)}
                        >
                            Pregled prijava
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <Row className="g-4 mb-4">
                <Col xs={12} lg={6}>
                    <Card className="h-100 border-0 shadow-sm rounded-3">
                        <Card.Header className="bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-bold text-danger">Što aplikacija omogućuje?</h5>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="px-0 py-3">
                                    <strong>Online prijave na fišijade:</strong> Brza i jednostavna prijava ekipa na sve aktualne lokalne i regionalne fišijade diljem Baranje.
                                </ListGroup.Item>
                                <ListGroup.Item className="px-0 py-3">
                                    <strong>Upravljanje prijavama (CRUD):</strong> Pregled svih prijavljenih ekipa, naknadna izmjena podataka (stol, kotizacija, članovi) te brisanje prijava.
                                </ListGroup.Item>
                                <ListGroup.Item className="px-0 py-3 border-bottom-0">
                                    <strong>Galerija fotografija ekipa:</strong> Mogućnost dodavanja i pregleda fotografija s natjecanja za svaku pojedinu prijavu (<strong>do 36 fotografija po ekipi</strong>) uz zumiranje u punoj rezoluciji.
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} lg={6}>
                    <Card className="h-100 border-0 shadow-sm rounded-3">
                        <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold text-dark">Prvenstvo Baranje i Hrvatske</h5>
                            <Badge bg="secondary">Od 2019. god.</Badge>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <div>
                                <p className="text-muted">
                                    Sustav u memoriji čuva sve završne fišijade – <strong>Prvenstva Baranje od samog osnutka u Belom Manastiru 2019. godine</strong>, koje danas predstavlja najveću hrvatsku fišijadu.
                                </p>
                                <p className="text-muted">
                                    U sklopu iste manifestacije održava se i <strong>Prvenstvo Hrvatske</strong>, na kojem snage odmjeravaju pobjednici svih regionalnih fišijada.
                                </p>
                            </div>

                            <div className="bg-light p-3 rounded-3 border mt-2">
                                <h6 className="fw-bold mb-2">Arhiva i administracija prvenstava:</h6>
                                <ul className="mb-0 small text-secondary ps-3">
                                    <li className="mb-1">Filtriranje održanih prvenstava po godinama.</li>
                                    <li className="mb-1">Uvid u povezane lokalne fišijade i ukupan broj prijava po godini.</li>
                                    <li>Ulaskom u <strong>Detalje</strong> moguće je pridružiti nove lokalne fišijade odabranom prvenstvu te dodavati pripadajuće prijave.</li>
                                </ul>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            <Card className="border-0 shadow-sm rounded-3 bg-dark text-white">
                <Card.Body className="p-3 p-md-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                    <div>
                        <span className="text-secondary small d-block">Autor i razvoj aplikacije</span>
                        <strong className="fs-6">Dragan Živković</strong>
                    </div>
                    <span className="badge bg-secondary fw-normal px-3 py-2">
                        Baranjske Fišijade • Evidencija i arhiva
                    </span>
                </Card.Body>
            </Card>
        </Container>
    )
}