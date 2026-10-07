import {IME_APLIKACIJE} from '../constants';
import fishSlika from '../assets/fish.jpg';



export default function Home(){


    return (
        <>

        <div>
        <img src={fishSlika} alt="Fishijada" 
        style={{width: '1200px', height:'auto',margin:'30px',padding:'2rem',border:'none'}}
        />

        </div>
            <p className='lead m5 text-center'>
                Dobrodošli na {IME_APLIKACIJE}

            </p>
        </>
    )
}