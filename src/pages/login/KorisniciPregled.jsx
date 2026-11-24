import { useState, useEffect } from "react"
import { Container, Table, Button, Alert, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import KorisnikService from "../../services/logiranje/KorisnikService"
import AuthService from "../../services/logiranje/AuthService"
import { RouteNames } from "../../constants"

export default function KorisniciPregled() {
    const [korisnici, setKorisnici] = useState([])
    const [prijavljeniKorisnik, setPrijavljeniKorisnik] = useState(null)
    const [poruka, setPoruka] = useState(null)
    const [greska, setGreska] = useState(null)
    const navigate = useNavigate()

    const ucitajPodatke = async () => {
        try {
            const trenutni = AuthService.dohvatiPrijavljenogKorisnika()
            setPrijavljeniKorisnik(trenutni)

            const odgovor = await KorisnikService.get()
            let dohvaceniKorisnici = odgovor.data || []

            if (trenutni) {
                const postojiVec = dohvaceniKorisnici.some(k => 
                    (k.email && trenutni.email && k.email.toLowerCase().trim() === trenutni.email.toLowerCase().trim()) ||
                    (k.sifra && trenutni.sifra && String(k.sifra) === String(trenutni.sifra))
                )

                if (!postojiVec) {
                    dohvaceniKorisnici.push({
                        sifra: trenutni.sifra || 'admin-trenutni',
                        ime: trenutni.ime || trenutni.imePrezime || 'Glavni',
                        prezime: trenutni.prezime || 'Admin',
                        email: trenutni.email,
                        uloga: trenutni.uloga || 'Admin'
                    })
                }
            }

            const jedinstveniKorisnici = dohvaceniKorisnici.filter((korisnik, index, self) =>
                index === self.findIndex((k) => (
                    k.email && korisnik.email && k.email.toLowerCase().trim() === korisnik.email.toLowerCase().trim()
                ))
            )

            jedinstveniKorisnici.sort((a, b) => {
                if (a.uloga === 'Admin' && b.uloga !== 'Admin') return -1;
                if (a.uloga !== 'Admin' && b.uloga === 'Admin') return 1;
                return 0;
            })

            setKorisnici(jedinstveniKorisnici)
        } catch (err) {
            console.error(err)
            setGreska("Greška prilikom dohvaćanja korisnika.")
        }
    }
    useEffect(() => {
        ucitajPodatke()
    }, [])

    const obrisiKorisnika = async (sifra) => {
        if (!window.confirm("Jeste li sigurni da želite obrisati ovog korisnika?")) {
            return
        }

        try {
            await KorisnikService.obrisi(sifra)
            setPoruka("Korisnik je uspješno obrisan.")
            ucitajPodatke()
        } catch (err) {
            console.error(err)
            setGreska("Greška prilikom brisanja korisnika.")
        }
    }

    const prisiliPromjenuLozinke = async (korisnik) => {
        const novaPrivremenaLozinka = prompt("Unesite novu privremenu lozinku za korisnika " + korisnik.email + ":");

        if (!novaPrivremenaLozinka) return;

        try {
            await KorisnikService.promjeni(korisnik.sifra, {
                ...korisnik,
                lozinka: novaPrivremenaLozinka
            });
            setPoruka(`Uspješno postavljena nova lozinka za korisnika ${korisnik.email}.`);
        } catch (err) {
            console.error(err);
            setGreska("Greška prilikom promjene lozinke.");
        }
    }

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3>Upravljanje korisnicima</h3>
                    <p className="text-muted mb-0">Pregled i administracija korisničkih računa sustava.</p>
                </div>
                <Button
                    variant="success"
                    className="rounded-pill px-4 shadow-sm"
                    onClick={() => navigate(`${RouteNames.KORISNICI}/dodaj`)}
                >
                    ➕ Dodaj novog korisnika
                </Button>
            </div>

            {poruka && <Alert variant="success" dismissible onClose={() => setPoruka(null)}>{poruka}</Alert>}
            {greska && <Alert variant="danger" dismissible onClose={() => setGreska(null)}>{greska}</Alert>}

            <Table striped bordered hover responsive className="shadow-sm bg-white rounded">
                <thead className="table-dark">
                    <tr>
                        <th>Ime i prezime</th>
                        <th>E-mail adresa</th>
                        <th>Uloga</th>
                        <th className="text-center">Administracijske akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {korisnici && korisnici.length > 0 ? (
                        korisnici.map((k) => {
                            const jeLiMojProfil = prijavljeniKorisnik && (String(k.sifra) === String(prijavljeniKorisnik.sifra) || k.email === prijavljeniKorisnik.email);

                            return (
                                <tr key={k.sifra}>
                                    <td className="align-middle fw-semibold">
                                        {k.ime || 'Nema imena'} {k.prezime || ''}
                                        {jeLiMojProfil && <Badge bg="info" className="ms-2">Ovo ste vi</Badge>}
                                    </td>
                                    <td className="align-middle">{k.email}</td>
                                    <td className="align-middle">
                                        <Badge bg={k.uloga === 'Admin' ? 'danger' : 'secondary'}>
                                            {k.uloga}
                                        </Badge>
                                    </td>
                                    <td className="text-center align-middle">
                                        {jeLiMojProfil ? (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="rounded-pill px-3"
                                                onClick={() => navigate(RouteNames.PROFIL)}
                                            >
                                                Uredi moj profil
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    className="me-2 rounded-pill px-3 text-dark fw-semibold"
                                                    onClick={() => prisiliPromjenuLozinke(k)}
                                                >
                                                    🔑 Resetiraj lozinku
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    className="rounded-pill px-3"
                                                    onClick={() => obrisiKorisnika(k.sifra)}
                                                >
                                                    Obriši
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4 text-muted">
                                Nema pronađenih korisnika u bazi.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    )
}