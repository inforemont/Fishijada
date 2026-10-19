import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import PrijavaService from "../../services/prijave/PrijavaService";
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import { GrValidate } from 'react-icons/gr';
import { FcApproval, FcDisapprove } from 'react-icons/fc';
import { NumericFormat } from 'react-number-format';
import FormatDatuma from '../../components/FormatDatuma';
import { RouteNames } from '../../constants';
import { Button } from "react-bootstrap";

export default function PrijavePregled() {
    const location = useLocation();
    const godina = location.state?.godina;



    return (
        <div>
            <h3 className='my-3'>Pregled prijava</h3>

            {godina ? (
                <p>Odabrana je godina: <strong>{godina}.</strong></p>
            ) : (
                <p>Nije odabrana niti jedna godina (prikaz svih prijava).</p>
            )}
            <PrijaveIzbor godina={godina} />
        </div>
    );
}

function PrijaveIzbor({ godina }) {
    const [prijave, setPrijave] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Došao na pregled prijava');
        ucitajPrijave();
    }, [godina]);

       async function obrisi(sifra) {
        if(!confirm('sigurno obrisati?')){
            return
        }

       await PrijavaService.obrisi(sifra)
       await  ucitajPrijave();
        
    }

    function detalji(sifra) {
        navigate(`/prijave/detalji/${sifra}`);
    }


    async function ucitajPrijave() {
        await PrijavaService.get().then((odgovor) => {
            let podaci = odgovor.data;

            setPrijave(podaci);
        });
    }

    return (
        <>
            <Link to={RouteNames.PRIJAVE_DODAJ}
            className="btn btn-success w-100 my-3">
                Dodavanje nove prijave
                </Link>

            <Table hover striped bordered> 
                <thead>
                    <tr>
                        <th>Ime i prezime</th>
                        <th>Ekipa</th>
                        <th>Stol</th>
                        <th>E-mail</th>
                        <th>Placeno</th>
                        <th>Prvenstvo Hrvatske</th>
                    </tr>
                </thead>
                <tbody>
                    {prijave && prijave.map((prijava) => {
                        const jeOdrzana = prijava.održana ?? prijava.održan ?? prijava.odrzana;

                        return (
                            <tr 
                                key={prijava.sifra}

                            >
                                <td className='lead'>
                                    {prijava.imePrezime}
                                    </td>
                                <td className='text-end'>
                                    {prijava.ekipa}
                                    </td>
                                <td className='desno'>
                                    <NumericFormat
                                    value={prijava.stol}
                                    displayType={'text'}
                                    decimalSeparator=","
                                    decimalScale={2}
                                    fixedDecimalScale='.'
                                    suffix=' €'
                                    prefix="="
                                    />
                                    </td>
                                <td style={{textAlign: 'center'}}>
                                        <FormatDatuma datum={prijava.email} prikazDatuma="Nije postavljeno" />
                                        </td>

                                <td>
                                    <GrValidate 
                                        size={25}
                                        color={jeOdrzana ? 'green' : 'red'}
                                        title={jeOdrzana ? 'Održana' : 'Nije održana'}
                                    />
                                    &nbsp;
                                    {jeOdrzana ? (
                                        <FcApproval />
                                    ) : (
                                        <FcDisapprove />
                                    )}
                                </td>
                                <td>
                                    <GrValidate 
                                        size={25}
                                        color={jeOdrzana ? 'green' : 'red'}
                                        title={jeOdrzana ? 'Održana' : 'Nije održana'}
                                    />
                                    &nbsp;
                                    {jeOdrzana ? (
                                        <FcApproval />
                                    ) : (
                                        <FcDisapprove />
                                    )}
                                </td>
                               <td>
                                <Button onClick={()=>{navigate(`/prijave/${prijava.sifra}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button variant="danger" onClick={()=>obrisi(prijava.sifra)}>
                                    Obriši
                                </Button>   
                                &nbsp;&nbsp;&nbsp;

                                <Button variant="success" onClick={()=>detalji(prijava.sifra)}>
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
                {prijave && prijave.length}
            </Badge>
            &nbsp; prijava
        </>
    );
}