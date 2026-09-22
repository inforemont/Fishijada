import { useLocation } from 'react-router-dom';

export default function FishijadePregled (){
const location = useLocation();

const godina = location.state?.godina;



    return(

        <div>
            <h3>Pregled Fishijada</h3>

            {godina ? (
                <p>Odabrana je godina: <strong>{godina}.</strong></p>
            ) : (
                <p>Nije odabrana niti jedna godina (prikaz svih fishijada).</p>
            )}
        </div>
    );
}