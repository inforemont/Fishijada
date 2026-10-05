import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import FishijadaService from "../../services/FishijadaService";
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import { GrValidate } from 'react-icons/gr';
import { FcApproval, FcDisapprove } from 'react-icons/fc';
import { NumericFormat } from 'react-number-format';
import FormatDatuma from '../../components/FormatDatuma';
import { RouteNames } from '../../constants';
import { Button } from "react-bootstrap";

export default function FishijadePregled() {
    const location = useLocation();
    const godina = location.state?.godina;



    return (
        <div>
            <h3 className='my-3'>Pregled Fishijada</h3>

            {godina ? (
                <p>Odabrana je godina: <strong>{godina}.</strong></p>
            ) : (
                <p>Nije odabrana niti jedna godina (prikaz svih fishijada).</p>
            )}
            <FishijadeIzbor godina={godina} />
        </div>
    );
}

function FishijadeIzbor({ godina }) {
    const [fishijade, setFishijade] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Došao na pregled fishijada');
        ucitajFishijade();
    }, [godina]);

    async function ucitajFishijade() {
        await FishijadaService.get().then((odgovor) => {
            let podaci = odgovor.data;

            if (godina) {
                podaci = podaci.filter(f => {
                    const godinaPokretanja = new Date(f.datumPokretanja).getFullYear();
                    return godinaPokretanja === Number(godina);
                });
            }
            setFishijade(podaci);
        });
    }

    return (
        <>
            <Link to={RouteNames.FISHIJADE_DODAJ}
            className="btn btn-success w-100 my-3">
                Dodavanje nove fišijade
                </Link>

            <Table hover striped bordered> 
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Mjesto održavanja</th>
                        <th>Kotizacija</th>
                        <th>Datum pokretanja</th>
                        <th>Održana</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {fishijade && fishijade.map((fishijada) => {
                        const jeOdrzana = fishijada.održana ?? fishijada.održan ?? fishijada.odrzana;

                        return (
                            <tr 
                                key={fishijada.sifra}

                            >
                                <td className='lead'>
                                    {fishijada.naziv}
                                    </td>
                                <td className='text-end'>
                                    {fishijada.mjestoOdrzavanja}
                                    </td>
                                <td className='desno'>
                                    <NumericFormat
                                    value={fishijada.cijena}
                                    displayType={'text'}
                                    decimalSeparator=","
                                    decimalScale={2}
                                    fixedDecimalScale='.'
                                    suffix=' €'
                                    prefix="="
                                    />
                                    </td>
                                <td style={{textAlign: 'center'}}>
                                        <FormatDatuma datum={fishijada.datumPokretanja} prikazDatuma="Nije postavljeno" />
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
                                <Button onClick={()=>{navigate(`/fishijade/${fishijada.sifra}`)}}>
                                    Promjena
                                </Button>
                            </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <Table>
                <tbody>
                    <td>Prvenstvo</td>
                    <td>Vrijeme početka</td>
                    <td>Broj kotlića</td>
                    <td>Pobjednici</td>
                    <td>Izvođači</td>
                    <td>Nagrade</td>
                    <td>Galerija slika</td>
                    <tr>Prvenstvo Baranje</tr>
                    <tr>Prvenstvo Hrvatske</tr>

                </tbody>
            </Table>

            Ukupno &nbsp;
            <Badge pill bg="success">
                {fishijade && fishijade.length}
            </Badge>
            &nbsp; fishijada
        </>
    );
}