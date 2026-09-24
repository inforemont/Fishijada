import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react"
import FishijadaService from "../../services/FishijadaService"

export default function FishijadePregled() {
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

 <FishijadeIzbor />

 function FishijadeIzbor() {

    const [fishijade,setFishijade]= useState([])  

    useEffect(()=>{    // to je hook useeffect
        console.log('Došao na pregled fishijada')
        ucitajFishijade()
    },[])

    async function ucitajFishijade(){
        await FishijadaService.get().then((odgovor)=>{
    
            setFishijade(odgovor.data)
        })
    }

    return(

        <>
            Ovdje dođe pregled fishijada
            
            <hr />
            <pre>
                {JSON.stringify(fishijade,null,2)}
            </pre>
          
        </>
    )
}