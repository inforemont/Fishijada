import { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { Faker, hr } from '@faker-js/faker';
import FishijadaService from '../services/FishijadaService';
import PrijavaService from '../services/prijave/PrijavaService';
import LokacijaService from '../services/lokacije/LokacijaService';


export default function GeneriranjePodataka() {
    const [brojFishijada, setBrojFishijada] = useState(1);
    const [brojPrijava, setBrojPrijava] = useState(10);
    const [brojLokacija, setBrojLokacija] = useState(20);
    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    // Postavi faker na hrvatski jezik
    const faker = new Faker({
        locale: [hr]
    });

    const generirajFishijade = async (broj) => {
    const rezultatLokacija = await LokacijaService.get();
    const lokacije = rezultatLokacija.data;

    if (lokacije.length === 0) {
        throw new Error('Nema dostupnih lokacija. Prvo generirajte lokacije.');
    }

    for (let i = 0; i < broj; i++) {
        // Odaberi nekoliko nasumičnih lokacija za ovu fišijadu
        const brojZaOdabrati = faker.number.int({ min: 2, max: Math.min(5, lokacije.length) });
        const randomLokacije = faker.helpers.arrayElements(
            lokacije.map(l => l.sifra), 
            brojZaOdabrati
        );

        const fishijada = {
            naziv: `Prvenstvo Baranje ${2020 + i}`,
            mjestoOdrzavanja: 'Beli Manastir',
            cijena: faker.number.float({ min: 10, max: 30, precision: 1 }),
            datumPokretanja: new Date(2020 + i, 4, 15).toISOString(),
            aktivan: i === 0,
            lokacije: randomLokacije
        };
        
        await FishijadaService.dodaj(fishijada);
    }
};

    const generirajPrijave = async (broj) => {
    const rezultatLokacija = await LokacijaService.get();
    const lokacije = rezultatLokacija.data;

    for (let i = 0; i < broj; i++) {
        const randomLokacija = lokacije.length > 0 ? lokacije[faker.number.int({ min: 0, max: lokacije.length - 1 })].sifra : null;
        
        const prijava = {
            // Ovdje smo zamijenili faker.word.noun() sa sigurnom opcijom:
            imePrezime: faker.person.firstName() + ' ' + faker.person.lastName(),
            ekipa: 'Ekipa ' + faker.person.lastName() + ' ' + faker.number.int({ min: 1, max: 100 }),
            stol: faker.number.int({ min: 1, max: 150 }),
            email: faker.internet.email(),
            kotizacijaPlacena: faker.datatype.boolean(),
            prvenstvoHrvatske: false,
            lokacija: randomLokacija
        };
        await PrijavaService.dodaj(prijava);
    }

};
    const generirajLokacije = async (broj) => {
    const naziviLokacija = [
        'Kneževi Vinogradi', 'Luč', 'Jagodnjak', 'Baranjsko Petrovo Selo', 
        'Petlovac', 'Lug', 'Kopačevo', 'Zmajevac', 'Batina', 'Darda'
    ];

    for (let i = 0; i < broj; i++) {
        await LokacijaService.dodaj({
            mjesto: naziviLokacija[i % naziviLokacija.length] + (i >= naziviLokacija.length ? ` ${Math.floor(i / naziviLokacija.length) + 1}` : ''),
            zupanija: 'Osječko-baranjska',
            postanskiUred: faker.string.numeric(5),
            datumOdrzavanja: faker.date.soon().toISOString().split('T')[0]
        });
    }
};

    const handleGenerirajFishijade = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajFishijade(brojFishijada);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojFishijada} fišijada!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju fišijada: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerirajPrijave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            
            await generirajPrijave(brojPrijava);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojPrijava} prijava!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju prijava: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiPrijave = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve prijave?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await PrijavaService.get();
            const prijave = rezultat.data;
            
            for (const prijava of prijave) {
                await PrijavaService.obrisi(prijava.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${prijave.length} prijava!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju prijava: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiFishijade = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve fišijade?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await FishijadaService.get();
            const fishijade = rezultat.data;
            
            for (const fishijada of fishijade) {
                await FishijadaService.obrisi(fishijada.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${fishijade.length} fišijada!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju fišijada: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerirajLokacije = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajLokacije(brojLokacija);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojLokacija} lokacija!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju lokacija: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiLokacije = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve lokacije?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await LokacijaService.get();
            const lokacije = rezultat.data;
            
            for (const lokacija of lokacije) {
                await LokacijaService.obrisi(lokacija.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${lokacije.length} lokacija!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju lokacija: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h1>Generiranje podataka</h1>
            <p className="text-muted">
                Koristite ovaj alat za generiranje testnih podataka s lažnim (fake) podacima na hrvatskom jeziku.
            </p>

            {poruka && (
                <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
                    {poruka.tekst}
                </Alert>
            )}

            <Row>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajFishijade}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj fišijada</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojFishijada}
                                onChange={(e) => setBrojFishijada(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj fišijada (1-50)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj fišijade'}
                        </Button>
                    </Form>
                </Col>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajPrijave}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj prijava</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="200"
                                value={brojPrijava}
                                onChange={(e) => setBrojPrijava(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj prijava (1-200)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj prijave'}
                        </Button>
                    </Form>
                </Col>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajLokacije}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj lokacija</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="100"
                                value={brojLokacija}
                                onChange={(e) => setBrojLokacija(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj lokacija (1-100)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj lokacije'}
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Alert variant="warning" className="mt-3">
                <strong>Upozorenje:</strong> Ove akcije će dodati nove podatke u postojeće. 
                Ako želite početi ispočetka, prvo obrišite postojeće podatke.
            </Alert>

            <hr className="my-4" />

            <h3>Brisanje podataka</h3>
            <p className="text-muted">
                Koristite ove opcije za brisanje svih podataka iz baze.
            </p>

            <Row className="mt-3">
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiFishijade}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve fišijade'}
                    </Button>
                </Col>
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiPrijave}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve prijave'}
                    </Button>
                </Col>
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiLokacije}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve lokacije'}
                    </Button>
                </Col>
            </Row>

            <Alert variant="danger" className="mt-3">
                <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
            </Alert>
        </Container>
    );
}
