import {IME_APLIKACIJE} from '../constants';
import fishSlika from '../assets/fish.jpg';



export default function Home(){


    return (
        <>

        <div>
        <img src={fishSlika} alt="Fishijada" className="img-fluid"
        
        />

        </div>
            <p className='lead m5 text-center'>
                Dobrodošli na {IME_APLIKACIJE}

            </p>
        </>
    )
}