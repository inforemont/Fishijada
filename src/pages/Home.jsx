import {IME_APLIKACIJE} from '../constants';
import fishSlika from '../assets/fish.jpg';
import {Container, Image} from 'react-bootstrap';



export default function Home(){


    return (
        <Container className="text-center my-4">


        <Image
         src={fishSlika}
         alt="Fishijada"
         fluid
         rounded
         style={{maxHeight: '600px', objectFit: 'cover', width: '90%'}}
        
        />


            <p className='lead m5 text-center'>
                Dobrodošli na {IME_APLIKACIJE}

            </p>
        </Container>
    )
}