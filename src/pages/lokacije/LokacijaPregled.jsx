import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import LokacijaService from "../../services/lokacije/LokacijaService";
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import { NumericFormat } from 'react-number-format';
import { RouteNames } from '../../constants';
import { Button } from "react-bootstrap";
import PrijavaService from '../../services/prijave/PrijavaService';

export default function LokacijePregled() {
    return (
        <div>
            <h3 className='my-3'>Pregled lokacija</h3>
            <LokacijeIzbor />
        </div>
    );
}

function LokacijeIzbor() {
    const [lokacije, setLokacije] = useState([]);
    const [prijave, setPrijave] = useState([]);
    const navigate = useNavigate();

    async function ucitajPrijave(){
        await PrijavaService.get().then((odgovor) => {
            setPrijave(odgovor.data);
        });
    }

    async function ucitajLokacije() {
        await LokacijaService.get().then((odgovor) => {
            let podaci = odgovor.data;
            setLokacije(podaci);
        });
    }

    // Pozivamo dohvaćanje podataka jednom prilikom učitavanja komponente
    useEffect(() => {
        ucitajPrijave();
        ucitajLokacije();
    }, []);

    async function obrisi(sifra) {
        if(!confirm('sigurno obrisati?')){
            return;
        }

        await LokacijaService.obrisi(sifra);
        await ucitajLokacije();
    }

    function detalji(sifra) {
        navigate(`/lokacije/detalji/${sifra}`);
    }

    function dohvatiPrijavu(sifraPrijave){
        return prijave.find(s => s.sifra === sifraPrijave) || {};
    }

    return (
        <>
            <Link to={RouteNames.PRIJAVE_DODAJ}
            className="btn btn-success w-100 my-3">
                Dodavanje nove lokacije
            </Link>

            <Table hover striped bordered> 
                <thead>
                    <tr>
                        <th>Mjesto</th>
                        <th>Županija</th>
                        <th>Poštanski ured</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {lokacije && lokacije.map((lokacija) => {                    
                        return (
                            <tr key={lokacija.sifra}>
                                <td className='lead'>
                                    {lokacija.mjesto}
                                </td>
                                <td className='text-end'>
                                    {lokacija.zupanija}
                                </td>
                                <td className='desno'>
                                    <NumericFormat
                                        value={lokacija.posta}
                                        displayType={'text'}
                                    />
                                </td>
                                <td>
                                    <Button onClick={()=>{navigate(`/lokacije/${lokacija.sifra}`)}}>
                                        Promjena
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button variant="danger" onClick={()=>obrisi(lokacija.sifra)}>
                                        Obriši
                                    </Button>   
                                    &nbsp;&nbsp;&nbsp;
                                    <Button variant="success" onClick={()=>detalji(lokacija.sifra)}>
                                        Detalji
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            Ukupno lokacija : &nbsp;
            <Badge pill bg="success">
                {lokacije && lokacije.length}
            </Badge>
            &nbsp;
        </>
    );
}