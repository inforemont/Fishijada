import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import FishijadaService from "../../services/FishijadaService";
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import { GrValidate } from 'react-icons/gr';
import { FcApproval, FcDisapprove } from 'react-icons/fc';

export default function FishijadePregled() {
    const location = useLocation();
    const godina = location.state?.godina;

    return (
        <div>
            <h3>Pregled Fishijada</h3>

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
            <Table hover striped bordered> 
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Mjesto održavanja</th>
                        <th>Cijena</th>
                        <th>Datum pokretanja</th>
                        <th>Održana</th>
                    </tr>
                </thead>
                <tbody>
                    {fishijade && fishijade.map((fishijada) => {
                        const jeOdrzana = fishijada.održana ?? fishijada.održan ?? fishijada.odrzana;

                        return (
                            <tr 
                                key={fishijada.sifra}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/fishijade/${fishijada.sifra}`)}
                            >
                                <td>{fishijada.naziv}</td>
                                <td>{fishijada.mjestoOdrzavanja}</td>
                                <td>{fishijada.cijena} €</td>
                                <td>{fishijada.datumPokretanja}</td>

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
                            </tr>
                        );
                    })}
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