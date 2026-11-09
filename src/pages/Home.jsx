import { IME_APLIKACIJE } from '../constants';
import { Container, Card } from 'react-bootstrap';
import kotlic_loop from '../assets/kotlic_loop.webm';

export default function Home() {
    return (
        <Container className="text-center my-4">

            <Card className="p-4 shadow-sm border-0" style={{ backgroundColor: '#eef3ef' }}>
                <div className="text-center my-2">
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        style={{ 
                            width: "100%",       
                            maxWidth: "1100px",  
                            height: "auto",     
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(138, 28, 28, 0.15)"
                        }}
                    >
                        <source src={kotlic_loop} type="video/webm" />
                        Vaš preglednik ne podržava video.
                    </video>
                </div>
                
                <h2 className="mt-4 font-weight-bold" style={{ color: '#2e4a34' }}>
                    Dobrodošli na {IME_APLIKACIJE}
                </h2>
                <p className="text-muted lead">
                    Središnje mjesto za praćenje i prijave na baranjske fišijade
                </p>
            </Card>
        </Container>
    )
}