import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";
import PrijavaService from "../../services/prijave/PrijavaService";
import { useState, useEffect } from "react";
import LokacijaService from "../../services/lokacije/LokacijaService";





export default function PrijavaNovi() {

    const navigate = useNavigate()
    const[lokacije,setLokacije]=useState([])
    const [odabranaLokacija, setOdabranaLokacija] = useState('')



    useEffect(()=>{
        LokacijaService.get().then((o)=>{
            setLokacije(o.data)
        })
    },[])

    async function dodaj(prijava){
        await PrijavaService.dodaj(prijava).then(()=>{
            navigate(RouteNames.PRIJAVE)
        })
    }


    function obradiSubmit(e){
        e.preventDefault() 
        const podaci = new FormData(e.target)

        if(!podaci.get('imePrezime')|| podaci.get('imePrezime').trim().length===0){
            alert("Ime i prezime je obavezno i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('imePrezime').trim().length<6 || podaci.get('imePrezime').trim().length>30){
            alert("Ime i Prezime mora sadržavati između 3 i 30 znakova")
            return 0
        }

        if(!podaci.get('ekipa')|| podaci.get('ekipa').trim().length===0){
            alert("Ekipa je obavezna i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('ekipa').trim().length<3 || podaci.get('ekipa').trim().length>30){
            alert("Ekipa mora sadržavati između 3 i 30 znakova")
            return 0
        }

        if (isNaN(podaci.get('stol'))|| podaci.get('stol')<1 || podaci.get('posta')>500){
            alert("Unesite ispravan broj stola")
            return
        }
        if(!podaci.get('stol')|| podaci.get('stol')===""){
            alert("Broj stola mora biti unešen")
            return 0
        }

        if(!podaci.get('email')|| podaci.get('email')===""){
            alert("Email je obavezna stavka")
            return 0
        }

        if(!podaci.get('email')|| podaci.get('email').trim().length===0){
            alert("Email je obavezan i ne smije sadržavati samo razmake ")
            return
        }
        if(podaci.get('email').trim().length<6 || podaci.get('email').trim().length>30){
            alert("Email mora sadržavati između 3 i 30 znakova")
            return 0
        }


        dodaj({
            imePrezime: podaci.get('imePrezime'),
            ekipa:podaci.get('ekipa'),
            stol: parseFloat(podaci.get('stol')),
            email:podaci.get('email'),
            kotizacijaPlacena: podaci.get('kotizacijaPlacena') === 'on',
            prvenstvoHrvatske: podaci.get('prvenstvoHrvatske') === 'on',
            lokacija: parseInt(podaci.get('lokacija')),
        })
    }

    const odabraniObjekt = lokacije.find(l => l.sifra == odabranaLokacija);
    const jeBeliManastir = odabraniObjekt?.mjesto === 'Beli Manastir';


    return (
        <>
            <h3 className="my-3">
                Dodavanje nove prijave
            </h3>

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="imePrezime">
                    <Form.Label>IME I PREZIME</Form.Label>
                    <Form.Control type="text" name="imePrezime" required />
                </Form.Group>

                <Form.Group controlId="ekipa">
                    <Form.Label>EKIPA</Form.Label>
                    <Form.Control type="text" name="ekipa" />
                </Form.Group>

                <Form.Group controlId="stol">
                    <Form.Label>STOL</Form.Label>
                    <Form.Control type="number" name="stol" />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" name="email" />
                </Form.Group>

                <Form.Group controlId="kotizacijaPlacena" className="mt-3">
                    <Form.Check label="Kotizacija uplaćena" name="kotizacijaPlacena" />
                </Form.Group>

                {jeBeliManastir && (
                    <Form.Group controlId="prvenstvoHrvatske" className="mt-3">
                        <Form.Check label="Prvenstvo Hrvatske" name="prvenstvoHrvatske" />
                    </Form.Group>
                )}

                <Form.Group controlId="lokacija" className="mt-3">
                    <FormLabel>LOKACIJA</FormLabel>
                    <Form.Select 
                        name="lokacija"
                        required
                        value={odabranaLokacija}
                        onChange={(e) => setOdabranaLokacija(e.target.value)}
                    >
                        <option value="">Odaberi lokaciju...</option>
                        {lokacije && lokacije.map((l)=>(
                            <option key={l.sifra} value={l.sifra}>
                            {l.mjesto}
                            </option>
                        ))}
                    </Form.Select>
                    </Form.Group>


                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.PRIJAVE}
                        className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>


        </>
    )
}