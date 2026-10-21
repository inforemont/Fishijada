import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import LokacijaService from "../../services/lokacije/LokacijaService";
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import { GrValidate } from 'react-icons/gr';
import { FcApproval, FcDisapprove } from 'react-icons/fc';
import { NumericFormat } from 'react-number-format';
import FormatDatuma from '../../components/FormatDatuma';
import { RouteNames } from '../../constants';
import { Button } from "react-bootstrap";

export default function LokacijePregled() {
    const location = useLocation();
    const godina = location.state?.godina;



    return (
        <div>
            <h3 className='my-3'>Pregled lokacija</h3>

            {godina ? (
                <p>Odabrana je godina: <strong>{godina}.</strong></p>
            ) : (
                <p>Nije odabrana niti jedna godina (prikaz svih lokacija).</p>
            )}
            <LokacijeIzbor godina={godina} />
        </div>
    );
}

function LokacijeIzbor({ godina }) {
    const [lokacije, setLokacije] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Došao na pregled lokacija');
        ucitajLokacije();
    }, [godina]);

       async function obrisi(sifra) {
        if(!confirm('sigurno obrisati?')){
            return
        }

       await LokacijaService.obrisi(sifra)
       await  ucitajLokacije();
        
    }

    function detalji(sifra) {
        navigate(`/lokacije/detalji/${sifra}`);
    }


    async function ucitajLokacije() {
        await LokacijaService.get().then((odgovor) => {
            let podaci = odgovor.data;

            setLokacije(podaci);
        });
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
                    </tr>
                </thead>
                <tbody>
                    {lokacije && lokacije.map((lokacija) => {                     

                        return (
                            <tr 
                                key={lokacija.sifra}

                            >
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

            Ukupno &nbsp;
            <Badge pill bg="success">
                {lokacije && lokacije.length}
            </Badge>
            &nbsp; lokacija
        </>
    );
}