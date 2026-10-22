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
import LokacijaService from '../../services/lokacije/LokacijaService';
import {Form} from "react-bootstrap"

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
    const[lokacije,setLokacije]=useState([])
    const[odabranaLokacija,setOdabranaLokacija]=useState('')

    const odabraniObjekt = lokacije.find(l => l.sifra == odabranaLokacija);
    const jeBeliManastir = odabraniObjekt?.mjesto === 'Beli Manastir';

    const filtriranePrijave = prijave.filter((prijava) => {
        if (odabranaLokacija === '') return true
        return prijava.lokacija == odabranaLokacija
        })






    useEffect(() => {
        ucitajPrijave();
        LokacijaService.get().then((o)=>{
            setLokacije(o.data)
        })
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

                <Form.Group className='mb-4'>
                <Form.Label>Filtriraj po lokaciji:</Form.Label>
                <Form.Select
                    value={odabranaLokacija}
                    onChange={(e) => setOdabranaLokacija(e.target.value)}
                >
                    <option value="">Sve lokacije</option>
                    {lokacije && lokacije.map((l) => (
                        <option key={l.sifra} value={l.sifra}>
                            {l.mjesto}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Table hover striped bordered> 
                <thead>
                    <tr>
                        <th>Ime i prezime</th>
                        <th>Ekipa</th>
                        <th>Stol</th>
                        <th>E-mail</th>
                        <th>Lokacija</th>
                        <th>Placeno</th>

                        {jeBeliManastir && <th>Prvenstvo Hrvatske</th>}
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {prijave && filtriranePrijave.map((prijava) => {
                        const jePlaceno = prijava.kotizacijaPlacena;
                        const jePrvenstvo=prijava.prvenstvoHrvatske;

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
                                    />
                                    </td>
                                <td style={{textAlign: 'center'}}>
                                        {prijava.email}
                                 </td>
                                                                <td style={{textAlign: 'center'}}>
                                        {lokacije && lokacije.find((l) => l.sifra === prijava.lokacija)?.mjesto}
                                 </td>

                                <td style={{textAlign:'center'}}>
                                    &nbsp;
                                    {jePlaceno ? (
                                        <FcApproval size={25} />
                                    ) : (
                                        <FcDisapprove size={25} />
                                    )}
                                </td>
                                <td>
                                   
                                    &nbsp;
                                  {jeBeliManastir && (
                    <td style={{textAlign:'center'}}>
                        {jePrvenstvo ? <FcApproval size={25} /> : <FcDisapprove size={25} />}
                    </td>
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
                {prijave && filtriranePrijave.length}
            </Badge>
            &nbsp; prijava
        </>
    );
}