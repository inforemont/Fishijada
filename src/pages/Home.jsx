import { IME_APLIKACIJE } from '../constants';
import { Container } from 'react-bootstrap';
import kotlic_loop from '../assets/kotlic_loop.webm';

export default function Home() {
    return (
        <Container className="text-center my-4">
            <div className="text-center my-4">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    style={{ 
                        width: "90%",       
                        maxWidth: "1200px",  
                        height: "auto",     
                        borderRadius: "10px" 
                    }}
                >
                    <source src={kotlic_loop} type="video/webm" />
                    Vaš preglednik ne podržava video.
                </video>
            </div>
            
            <p className='lead m-5 text-center'>
                Dobrodošli na {IME_APLIKACIJE}
            </p>
        </Container>
    )
}